const { useState } = React;

const LightGame = () => {
  const [grid, setGrid] = useState(Array(10).fill().map(() => Array(10).fill(false)));
  const [moves, setMoves] = useState(0);

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

  const renderCell = (isOn) => {
    return React.createElement('i', {
      'data-lucide': isOn ? 'lightbulb' : 'lightbulb-off',
      className: isOn ? 'w-8 h-8 text-yellow-400' : 'w-8 h-8 text-gray-400'
    });
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <div className="space-x-4 mb-4">
        <button 
          onClick={loadExample} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          예제 로드
        </button>
        <button 
          onClick={generateRandom} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          랜덤 생성
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
              >
                {renderCell(cell)}
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

// Initialize Lucide icons when the component mounts
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// Render the app
ReactDOM.render(<LightGame />, document.getElementById('root'));
