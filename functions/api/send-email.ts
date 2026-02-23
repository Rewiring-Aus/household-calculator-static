interface Env {
  LOOPS_API_KEY: string;
  LOOPS_TRANSACTIONAL_ID: string;
  HUBSPOT_API_KEY: string;
}

interface RequestBody {
  email: string;
  savings: {
    opex?: {
      perYear?: { difference?: number };
      perWeek?: { difference?: number };
    };
    recommendation?: {
      action?: string;
      url?: string;
    };
  };
  household: {
    location?: string;
    [key: string]: unknown;
  };
}

type PagesFunction<E = Record<string, string>> = (context: {
  request: Request;
  env: E;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Response | Promise<Response>;

const actionLabels: Record<string, string> = {
  SPACE_HEATING: 'Upgrade your space heating',
  WATER_HEATING: 'Upgrade your water heating',
  COOKING: 'Upgrade your cooktop',
  VEHICLE: 'Switch to an EV',
  SOLAR: 'Install solar panels',
  BATTERY: 'Install a home battery',
  FULLY_ELECTRIFIED: 'Your home is fully electrified!',
};

const locationToState: Record<string, string> = {
  NEW_SOUTH_WALES: 'NSW',
  VICTORIA: 'VIC',
  QUEENSLAND: 'QLD',
  SOUTH_AUSTRALIA: 'SA',
  WESTERN_AUSTRALIA: 'WA',
  NORTHERN_TERRITORY: 'NT',
  AUSTRALIAN_CAPITAL_TERRITORY: 'ACT',
  TASMANIA: 'TAS',
};

function fmtSavings(value: number | undefined): string {
  if (!value) return '$0';
  return `$${Math.abs(Math.round(value)).toLocaleString('en-AU')}`;
}

async function upsertHubspotContact(
  email: string,
  savings: RequestBody['savings'],
  household: RequestBody['household'],
  env: Env,
): Promise<void> {
  const properties: Record<string, string> = {
    email,
    calculator_annual_savings: String(Math.round((savings.opex?.perYear?.difference ?? 0) * -1)),
    calculator_recommendation: savings.recommendation?.action ?? '',
    calculator_last_submitted_at: String(Date.now()),
  };

  // Only set state if not already on the contact record
  const locationState = locationToState[household.location ?? ''];
  if (locationState) {
    const existing = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=state`,
      { headers: { Authorization: `Bearer ${env.HUBSPOT_API_KEY}` } },
    ).catch(() => null);

    if (existing?.ok) {
      const data = await existing.json() as { properties?: { state?: string } };
      if (!data.properties?.state) {
        properties.state = locationState;
      }
    } else {
      // Contact doesn't exist yet
      properties.state = locationState;
    }
  }

  await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.HUBSPOT_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: [{ id: email, idProperty: 'email', properties }],
    }),
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json' };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers });
  }

  const { email, savings, household } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers });
  }

  const origin = new URL(request.url).origin;
  const shareableUrl = `${origin}/#/?h=${encodeURIComponent(btoa(JSON.stringify(household)))}`;

  const loopsResponse = await fetch('https://app.loops.so/api/v1/transactional', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify({
      transactionalId: env.LOOPS_TRANSACTIONAL_ID,
      email,
      dataVariables: {
        calc_yearly_savings: fmtSavings(savings.opex?.perYear?.difference),
        calc_weekly_savings: fmtSavings(savings.opex?.perWeek?.difference),
        calc_reco_label: actionLabels[savings.recommendation?.action ?? ''] ?? 'Explore your options',
        calc_reco_url: savings.recommendation?.url ?? 'https://www.rewiringaustralia.org/research-and-resources',
        calc_report_url: shareableUrl,
      },
    }),
  });

  if (!loopsResponse.ok) {
    const errorText = await loopsResponse.text();
    console.error('Loops error:', errorText);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers });
  }

  // Upsert HubSpot contact after response is returned
  context.waitUntil(
    upsertHubspotContact(email, savings, household, env).catch(
      (err) => console.error('HubSpot upsert error:', err),
    ),
  );

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
