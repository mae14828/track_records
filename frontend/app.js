const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('showJson');
  if (btn) btn.addEventListener('click', loadTableJson);

  const form = document.getElementById('playerForm');
  if (form) form.addEventListener('submit', insertPlayer);

  loadTableJson();
});

async function loadTableJson() {
  const pre = document.getElementById('tableJson');
  if (!pre) return;
  pre.textContent = '読み込み中...';

  try {
    const response = await fetch(`${API_URL}/records`);
    const tableData = await response.json();
    pre.textContent = JSON.stringify(tableData, null, 2);
  } catch (error) {
    pre.textContent = `エラー: ${error.message}`;
  }
}

async function insertPlayer(event) {
  event.preventDefault();

  const pre = document.getElementById('tableJson');
  if (!pre) return;

  const playerName = document.getElementById('playerName').value;
  const gender = document.getElementById('gender').value;

  pre.textContent = '送信中...';

  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_name: playerName, gender })
    });

    const data = await response.json();
    pre.textContent = JSON.stringify(data, null, 2);

    await loadTableJson();
  } catch (error) {
    pre.textContent = `エラー: ${error.message}`;
  }
}