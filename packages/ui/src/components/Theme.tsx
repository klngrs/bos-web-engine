import styled from 'styled-components';

export const Theme = styled.div`
  --color-border-1: #4a4a4a;
  --color-text-1: #fff;
  --color-text-2: #a8a8a8;
  --color-surface-1: #000;
  --color-surface-2: #131313;
  --color-surface-3: #1e1e1e;
  --color-surface-4: #333333;
  --color-surface-primary: #6e63d4;
  --color-focus-outline: #b7b2f0;
  --color-affirm: #7af5b8;
  --color-danger: #d76464;

  --font-primary: 'Inter', sans-serif;

  --text-xs: 400 12px/1.4 var(--font-primary);
  --text-s: 400 14px/1.5 var(--font-primary);
  --text-base: 400 16px/1.5 var(--font-primary);
  --text-l: 400 20px/1.3 var(--font-primary);
  --text-xl: 700 24px/1.3 var(--font-primary);
  --text-2xl: 700 30px/1.3 var(--font-primary);
  --text-3xl: 700 42px/1.3 var(--font-primary);
  --text-hero: 700 72px/1 var(--font-primary);

  font-family: var(--font-primary);
  line-height: 1.5;
  background: var(--color-surface-1);
  color: var(--color-text-1);
  -webkit-font-smoothing: antialiased;

  h1 {
    font: var(--text-2xl);
  }
  h2 {
    font: var(--text-xl);
  }
  h3 {
    font: var(--text-l);
  }
  h4 {
    font: var(--text-base);
  }
  h5 {
    font: var(--text-s);
  }
  h6 {
    font: var(--text-xs);
  }
  p {
    font: var(--text-base);
  }
`;
