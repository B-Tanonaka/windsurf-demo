import CatFact from './components/CatFact';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #2d1a4a 0%, #3d215a 100%)',
      backgroundSize: 'cover',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '3rem',
        color: '#333'
      }}>
        Random Cat Fact Generator
      </h1>
      <CatFact />
    </div>
  );
}

export default App;
