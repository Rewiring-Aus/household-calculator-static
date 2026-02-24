import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import type { Household, Savings } from 'src/calculator/types';

interface EmailReportFormProps {
  results: Savings;
  household: Household;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const EmailReportForm: React.FC<EmailReportFormProps> = ({ results, household }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, savings: results, household }),
      });
      setFormState(response.ok ? 'success' : 'error');
    } catch {
      setFormState('error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h2" sx={{ mb: 0.5 }}>
        Email me my report
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Includes your savings summary and personalised next steps.
      </Typography>
      {formState === 'success' ? (
        <Typography variant="body1">Report sent! Check your inbox.</Typography>
      ) : (
        <>
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={formState === 'loading'}
            size="small"
            sx={{ mb: 1, '& .MuiInputBase-root': { backgroundColor: 'white' } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={formState === 'loading'}
            fullWidth
            sx={{
              textTransform: 'initial',
              fontSize: '1.0625rem',
              borderRadius: '8px',
              boxShadow: 'none',
              padding: '0.75rem',
              '&:hover': { boxShadow: 'none', backgroundColor: 'info.dark' },
            }}
          >
            {formState === 'loading' ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Send report'
            )}
          </Button>
          <Typography variant="caption" sx={{ mt: 0.75, color: 'text.secondary', display: 'block' }}>
            You'll receive updates from Rewiring Australia.
          </Typography>
          {formState === 'error' && (
            <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
              Something went wrong, please try again.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default EmailReportForm;
