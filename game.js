const { useState, useCallback, useRef } = React;

const LightGame = () => {
  const [grid, setGrid] = useState(Array(10).fill().map(() => Array(10).fill(false)));
  const [moves, setMoves] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const intervalRef = useRef(null);

  const example = [
    "#O########",
    "OOO#######",
    "#O########",
    "####OO####",
    "###O##O###",
    "####OO####",
    "##########",
    "########O#",
    "#######OOO",
    "########O#"
  ];

  const toggleLights = (row, col) => {
    const newGrid = grid.map(row => [...row]);
    const directions = [
      [0, 0],   // current
      [-1, 0],  // up
      [1, 0],   // down
      [0, -1],  // left
      [0, 1]    // right
    ];
    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
        newGrid[newRow][newCol] = !newGrid[newRow][newCol];
      }
    });
    setGrid(newGrid);
    setMoves(moves + 1);
  };

  const loadExample = () => {
    const newGrid = example.map(row => 
      row.split('').map(cell => cell === 'O')
    );
    setGrid(newGrid);
    setMoves(0);
  };

  const generateRandom = () => {
    const newGrid = Array(10).fill().map(() => 
      Array(10).fill().map(() => Math.random() < 0.3)
    );
    setGrid(newGrid);
    setMoves(0);
  };

  const isComplete = () => grid.every(row => row.every(cell => !cell));

  const toggle = (board, i, j) => {
    board[i][j] = !board[i][j];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10) {
        board[ni][nj] = !board[ni][nj];
      }
    }
  };

  const solve = useCallback(() => {
    const solution = [];
    let minPress = Infinity;

    // Try all possible combinations for the first row
    for (let firstRowMask = 0; firstRowMask < (1 << 10); firstRowMask++) {
      const board = grid.map(row => [...row]);
      const moves = [];
      let pressCount = 0;

      // Handle first row
      for (let j = 0; j < 10; j++) {
        if (firstRowMask & (1 << j)) {
          toggle(board, 0, j);
          moves.push([0, j]);
          pressCount++;
        }
      }

      // Handle remaining rows
      for (let i = 1; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (board[i-1][j]) {
            toggle(board, i, j);
            moves.push([i, j]);
            pressCount++;
          }
        }
      }

      // Check if last row is all off
      const isValid = board[9].every(cell => !cell);
      if (isValid && pressCount < minPress) {
        minPress = pressCount;
        solution.length = 0;
        solution.push(...moves);
      }
    }

    return minPress !== Infinity ? solution : null;
  }, [grid]);

  const autoSolve = async () => {
    const solution = solve();
    if (!solution) {
      alert("해결책을 찾을 수 없습니다!");
      return;
    }

    setIsSolving(true);
    let index = 0;

    intervalRef.current = setInterval(() => {
      if (index >= solution.length) {
        clearInterval(intervalRef.current);
        setIsSolving(false);
        return;
      }

      const [i, j] = solution[index];
      toggleLights(i, j);
      index++;
    }, 500);
  };

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <div className="space-x-4 mb-4">
        <button 
          onClick={loadExample} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSolving}
        >
          예제 로드
        </button>
        <button 
          onClick={generateRandom} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isSolving}
        >
          랜덤 생성
        </button>
        <button 
          onClick={autoSolve} 
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={isSolving}
        >
          자동 해결
        </button>
      </div>

      <div className="border border-gray-300 p-4 rounded-lg">
        {grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => toggleLights(i, j)}
                className="p-2 transition-colors duration-200"
                disabled={isSolving}
              >
                <span className={cell ? 'light-on' : 'light-off'}>
                  {cell ? '💡' : '⚪'}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="text-lg">
        이동 횟수: {moves}
      </div>
      
      {isComplete() && moves > 0 && (
        <div className="text-green-500 font-bold text-xl">
          축하합니다! {moves}번 만에 완료하셨습니다!
        </div>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<LightGame />, document.getElementById('root'));
