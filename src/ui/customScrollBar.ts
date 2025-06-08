export const customScrollBar = {
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#2c2a4a',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #a18bff, #8e84f7)',
    borderRadius: '10px',
    border: '2px solid #2c2a4a',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(180deg, #8e84f7, #7a6bf5)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#8e84f7 #2c2a4a',
};
