import './components/TicTacToe.css';
import TicTacToe from './components/TicTacToe';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #001a33 0%, #00264d 100%)',
      backgroundSize: 'cover',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <TicTacToe />
      </div>
    </div>
  );
}

export default App;
