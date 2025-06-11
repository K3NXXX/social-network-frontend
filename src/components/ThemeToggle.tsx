import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--secondary-color)',
        color: 'var(--text-color)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
};
