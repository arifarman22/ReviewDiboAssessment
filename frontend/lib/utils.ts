export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  const classes: string[] = [];
  inputs.forEach((input) => {
    if (!input) return;
    if (typeof input === 'string') {
      classes.push(input.trim());
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key.trim());
      });
    }
  });
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
