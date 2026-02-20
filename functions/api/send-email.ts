interface Env {
  RESEND_API_KEY: string;
}

interface SavesRequest {
  email: string;
  savings: {
    opex?: {
      perYear?: { difference?: number };
      perWeek?: { difference?: number };
      overLifetime?: { difference?: number };
    };
    emissions?: {
      perYear?: { before?: number; difference?: number };
    };
    upfrontCost?: {
      solar?: number;
      battery?: number;
      cooktop?: number;
      waterHeating?: number;
      spaceHeating?: number;
    };
    recommendation?: {
      action?: string;
      url?: string;
    };
  };
  household: Record<string, unknown>;
}

type PagesFunction<E = Record<string, string>> = (context: {
  request: Request;
  env: E;
  params: Record<string, string>;
}) => Response | Promise<Response>;

const fmtSavings = (value: number | undefined): string => {
  if (value === undefined || value === null) return '$0';
  return `$${Math.abs(Math.round(value)).toLocaleString('en-AU')}`;
};

const actionLabels: Record<string, string> = {
  SPACE_HEATING: 'Upgrade your space heating',
  WATER_HEATING: 'Upgrade your water heating',
  COOKING: 'Upgrade your cooktop',
  VEHICLE: 'Switch to an EV',
  SOLAR: 'Install solar panels',
  BATTERY: 'Install a home battery',
  FULLY_ELECTRIFIED: "Your home is fully electrified!",
};

function renderHtml(data: SavesRequest, shareableUrl: string): string {
  const { savings } = data;
  const { opex, emissions, upfrontCost, recommendation } = savings;

  const perYear = fmtSavings(opex?.perYear?.difference);
  const perWeek = fmtSavings(opex?.perWeek?.difference);
  const over15Years = fmtSavings(opex?.overLifetime?.difference);

  const emissionsReduction = emissions?.perYear
    ? Math.round(((emissions.perYear.difference ?? 0) / (emissions.perYear.before ?? 1)) * -100)
    : 0;
  const emissionsKg = emissions?.perYear?.difference
    ? Math.abs(Math.round(emissions.perYear.difference))
    : 0;

  const costBreakdown = [
    { label: 'Space heating', value: upfrontCost?.spaceHeating },
    { label: 'Water heating', value: upfrontCost?.waterHeating },
    { label: 'Cooktop', value: upfrontCost?.cooktop },
    { label: 'Solar', value: upfrontCost?.solar },
    { label: 'Battery', value: upfrontCost?.battery },
  ].filter((item): item is { label: string; value: number } => item.value !== undefined && item.value > 0);

  const totalCost = costBreakdown.reduce(
    (sum, item) => sum + Math.round(item.value / 100) * 100,
    0,
  );

  const actionLabel = recommendation?.action
    ? (actionLabels[recommendation.action] ?? recommendation.action)
    : 'Explore your options';
  const recommendationUrl =
    recommendation?.url ?? 'https://www.rewiringaustralia.org/research-and-resources';

  const breakdownRows = costBreakdown
    .map(
      (item) =>
        `<tr>
          <td style="padding:3px 0;font-size:14px;color:#444444;">${item.label}</td>
          <td style="padding:3px 0;font-size:14px;color:#444444;text-align:right;font-weight:600;">$${(Math.round(item.value / 100) * 100).toLocaleString('en-AU')}</td>
        </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Your Household Electrification Report</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFBE7;font-family:Arial,sans-serif;color:#222222;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFBE7;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#4A00C3;padding:32px 32px 24px 32px;border-radius:8px 8px 0 0;">
              <p style="margin:0 0 8px 0;color:#FCEDC0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Rewiring Australia</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.2;">Your Household Electrification Report</h1>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="background-color:#ffffff;padding:24px 32px 8px 32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#222222;">By electrifying your household, we estimate you could save:</p>
            </td>
          </tr>

          <!-- Energy & Fuel Bills -->
          <tr>
            <td style="background-color:#ffffff;padding:16px 32px 8px 32px;">
              <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#666666;text-transform:uppercase;letter-spacing:0.5px;">Energy &amp; Fuel Bills</p>
              <p style="margin:0 0 4px 0;font-size:22px;font-weight:700;color:#4A00C3;">${perYear} saved per year</p>
              <p style="margin:0 0 4px 0;font-size:16px;color:#222222;"><strong>${perWeek}</strong> saved per week</p>
              <p style="margin:0;font-size:16px;color:#222222;"><strong>${over15Years}</strong> saved over 15-year product lifetime</p>
              <hr style="border:none;border-top:1px solid #eeeeee;margin:16px 0 0 0;">
            </td>
          </tr>

          <!-- Emissions -->
          <tr>
            <td style="background-color:#ffffff;padding:16px 32px 8px 32px;">
              <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#666666;text-transform:uppercase;letter-spacing:0.5px;">Energy Emissions</p>
              <p style="margin:0 0 4px 0;font-size:22px;font-weight:700;color:#4A00C3;">${emissionsReduction}% saved</p>
              <p style="margin:0;font-size:16px;color:#222222;">That's <strong>${emissionsKg.toLocaleString('en-AU')} kgs of CO&#8322;e</strong> saved every year!</p>
              <hr style="border:none;border-top:1px solid #eeeeee;margin:16px 0 0 0;">
            </td>
          </tr>

          <!-- Upgrade Costs -->
          <tr>
            <td style="background-color:#ffffff;padding:16px 32px 24px 32px;">
              <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#666666;text-transform:uppercase;letter-spacing:0.5px;">Upgrade Cost</p>
              <p style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#4A00C3;">$${totalCost.toLocaleString('en-AU')}</p>
              ${
                breakdownRows
                  ? `<table width="100%" cellpadding="0" cellspacing="0">${breakdownRows}</table>`
                  : ''
              }
            </td>
          </tr>

          <!-- Next Step CTA -->
          <tr>
            <td style="background-color:#F0CF61;padding:24px 32px;">
              <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#222222;">Your next step</p>
              <p style="margin:0 0 16px 0;font-size:16px;color:#222222;">${actionLabel}</p>
              <a href="${recommendationUrl}" style="display:inline-block;background-color:#4A00C3;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:16px;font-weight:600;">Show me how</a>
            </td>
          </tr>

          <!-- View Report Online CTA -->
          <tr>
            <td style="background-color:#ffffff;padding:24px 32px;">
              <p style="margin:0 0 12px 0;font-size:16px;color:#222222;">Want to explore your results again? View your personalised report online:</p>
              <a href="${shareableUrl}" style="display:inline-block;background-color:#4A00C3;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:16px;font-weight:600;">View your report online</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f5f5;padding:20px 32px;border-radius:0 0 8px 8px;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#666666;">
                <a href="https://www.rewiringaustralia.org/" style="color:#4A00C3;text-decoration:none;">Rewiring Australia</a> — Electrifying everything, for everyone.
              </p>
              <p style="margin:0;font-size:11px;color:#999999;line-height:1.5;">
                Rewiring Australia disclaims and excludes all liability for any claim, loss, demand or damages of any kind whatsoever (including for negligence) arising out of or in connection with the use of either this website or the tools, information, content or materials included on this site or on any website we link to.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { 'Content-Type': 'application/json' };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  let body: SavesRequest;
  try {
    body = (await request.json()) as SavesRequest;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers });
  }

  const { email, savings, household } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers });
  }

  const origin = new URL(request.url).origin;
  const shareableUrl = `${origin}/#/?h=${encodeURIComponent(btoa(JSON.stringify(household)))}`;

  const html = renderHtml(body, shareableUrl);

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'calculator@updates.rewiringaustralia.org',
      to: email,
      subject: 'Your Household Electrification Report',
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error('Resend error:', errorText);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
