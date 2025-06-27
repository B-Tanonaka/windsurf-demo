import React, { Component, createRef } from 'react';

interface DinoState {
  x: number;
  y: number;
  vy: number;
  jumping: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GameProps {}

interface GameState {
  gameState: 'start' | 'playing' | 'gameOver';
  dinoState: DinoState;
  score: number;
  obstacles: Obstacle[];
  lastObstacleTime: number;
}

class Game extends Component<GameProps, GameState> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private ctxRef: React.RefObject<CanvasRenderingContext2D>;

  constructor(props: GameProps) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();
    this.ctxRef = createRef<CanvasRenderingContext2D>();

    this.state = {
      gameState: 'start',
      dinoState: {
        x: 50,
        y: 300,
        vy: 0,
        jumping: false,
      },
      score: 0,
      obstacles: [],
      lastObstacleTime: 0
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      const { gameState, dinoState } = this.state;
      if (gameState === 'start') {
        this.setState({
          gameState: 'playing',
          score: 0,
          dinoState: {
            x: 50,
            y: 300,
            vy: 0,
            jumping: false,
          }
        });
      } else if (gameState === 'playing' && !dinoState.jumping) {
        this.setState(prev => ({
          dinoState: { ...prev.dinoState, vy: -15, jumping: true }
        }));
      } else if (gameState === 'gameOver') {
        this.setState({ gameState: 'start' });
      }
    }
  };

  gameLoop = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const canvasWidth = 800;
    const canvasHeight = 400;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw ground
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 350, canvasWidth, 50);

    // Draw dino
    ctx.fillStyle = '#333';
    const { dinoState } = this.state;
    ctx.fillRect(dinoState.x, dinoState.y, 50, 50);

    // Draw obstacles
    ctx.fillStyle = '#666';
    this.state.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Update dino position
    let newDinoState: DinoState = { ...dinoState };
    const { gameState } = this.state;
    if (gameState === 'playing') {
      if (newDinoState.jumping) {
        newDinoState.vy += 0.5;
        newDinoState.y += newDinoState.vy;

        if (newDinoState.y > 300) {
          newDinoState.y = 300;
          newDinoState.vy = 0;
          newDinoState.jumping = false;
        }
      }

      // Update obstacles
      const newObstacles = this.state.obstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - 5
      })).filter(obstacle => obstacle.x > -obstacle.width);

      // Add new obstacle if needed
      const currentTime = Date.now();
      const timeSinceLastObstacle = currentTime - this.state.lastObstacleTime;
      if (timeSinceLastObstacle > 1000) {
        const newObstacle = {
          x: canvasWidth,
          y: 300,
          width: 30,
          height: 50
        };
        newObstacles.push(newObstacle);
        this.setState({ lastObstacleTime: currentTime });
      }

      // Check for collisions
      const dinoRect = {
        x: dinoState.x,
        y: dinoState.y,
        width: 50,
        height: 50
      };

      const collision = newObstacles.some(obstacle => {
        return !(
          dinoRect.x + dinoRect.width < obstacle.x ||
          dinoRect.x > obstacle.x + obstacle.width ||
          dinoRect.y + dinoRect.height < obstacle.y ||
          dinoRect.y > obstacle.y + obstacle.height
        );
      });

      if (collision) {
        this.setState({ gameState: 'gameOver' });
      }

      this.setState({
        dinoState: newDinoState,
        obstacles: newObstacles
      });

      if (gameState === 'playing') {
        this.setState(prev => ({ score: prev.score + 0.1 }));
      }
    }

    requestAnimationFrame(this.gameLoop);
  };

  render() {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        aspectRatio: '2/1',
        backgroundColor: '#f0f0f0',
        border: '1px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <canvas ref={this.canvasRef} style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }} />
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px',
          zIndex: 1,
          color: '#000'
        }}>
          <span>Score: {Math.floor(this.state.score)}</span>
        </div>
        {this.state.gameState !== 'playing' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#000',
            zIndex: 1
          }}>
            {this.state.gameState === 'start' ? (
              <h2>Press SPACE to start</h2>
            ) : (
              <>
                <h2>Game Over!</h2>
                <p>Score: {Math.floor(this.state.score)}</p>
                <p>Press SPACE to restart</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.gameLoop();
  }
}

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'start') {
          setGameState('playing');
          setScore(0);
          setDinoState({
            x: 50,
            y: GROUND_Y - DINO_HEIGHT,
            vy: 0,
            jumping: false,
          });
        } else if (gameState === 'playing' && !dinoState.jumping) {
          setDinoState(prev => ({ ...prev, vy: JUMP_FORCE, jumping: true }));
        } else if (gameState === 'gameOver') {
          setGameState('start');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Game loop
    const gameLoop = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, GROUND_Y, canvas.width, 50);

      // Draw dino
      ctx.fillStyle = '#333';
      ctx.fillRect(dinoState.x, dinoState.y, DINO_WIDTH, DINO_HEIGHT);

      // Draw obstacles
      ctx.fillStyle = '#666';
      obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Update dino position
      let newDinoState: DinoState = { ...dinoState };
      if (gameState === 'playing') {
        if (newDinoState.jumping) {
          newDinoState.vy += GRAVITY;
          newDinoState.y += newDinoState.vy;

          if (newDinoState.y > GROUND_Y - DINO_HEIGHT) {
            newDinoState.y = GROUND_Y - DINO_HEIGHT;
            newDinoState.vy = 0;
            newDinoState.jumping = false;
          }
        }

        // Update obstacles
        const newObstacles = obstacles.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - 5
        })).filter(obstacle => obstacle.x > -obstacle.width);

        // Add new obstacle if needed
        const currentTime = Date.now();
        const timeSinceLastObstacle = currentTime - lastObstacleTime;
        if (timeSinceLastObstacle > OBSTACLE_GAP) {
          const newObstacle = {
            x: canvas.width,
            y: GROUND_Y - OBSTACLE_HEIGHT,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT
          };
          newObstacles.push(newObstacle);
          setLastObstacleTime(currentTime);
        }

        // Check for collisions
        const dinoRect = {
          x: dinoState.x,
          y: dinoState.y,
          width: DINO_WIDTH,
          height: DINO_HEIGHT
        };

        const collision = newObstacles.some(obstacle => {
          return !(
            dinoRect.x + dinoRect.width < obstacle.x ||
            dinoRect.x > obstacle.x + obstacle.width ||
            dinoRect.y + dinoRect.height < obstacle.y ||
            dinoRect.y > obstacle.y + obstacle.height
          );
        });

        if (collision) {
          setGameState('gameOver');
        }

        setObstacles(newObstacles);
      }

      setDinoState(newDinoState);

      if (gameState === 'playing') {
        setScore(prev => prev + 0.1);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      aspectRatio: '2/1',
      backgroundColor: '#f0f0f0',
      border: '1px solid #000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <canvas ref={canvasRef} style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }} />
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px',
        zIndex: 1,
        color: '#000'
      }}>
        <span>Score: {Math.floor(score)}</span>
      </div>
      {gameState !== 'playing' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#000',
          zIndex: 1
        }}>
          {gameState === 'start' ? (
            <h2>Press SPACE to start</h2>
          ) : (
            <>
              <h2>Game Over!</h2>
              <p>Score: {Math.floor(score)}</p>
              <p>Press SPACE to restart</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
