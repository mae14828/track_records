const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('showJson');
  if (btn) btn.addEventListener('click', loadTableJson);

  const form = document.getElementById('playerForm');
  if (form) form.addEventListener('submit', insertPlayer);

  const deleteForm = document.getElementById('deleteForm');
  if (deleteForm) deleteForm.addEventListener('submit', deletePlayer);

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

  try {//フロントからバック、バックからフロンt、どっちもやってる
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_name: playerName, gender })
    });
    console.log("response", response)
    const data = await response.json();
    console.log("data", data)
    pre.textContent = JSON.stringify(data, null, 2);

    await loadTableJson();
  } catch (error) {
    pre.textContent = `エラー: ${error.message}`;
  }
}

async function deletePlayer(event) {
  event.preventDefault();

  const pre = document.getElementById('tableJson');
  const playerId = document.getElementById('deleteId').value;

  if (!playerId) {
    pre.textContent = 'player_idを入力してください';
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/players/${playerId}`,
      {
        method: 'DELETE'
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '削除失敗');
    }

    pre.textContent =
      `削除成功\n${JSON.stringify(data, null, 2)}`;

    await loadTableJson();

  } catch (error) {
    pre.textContent = `エラー: ${error.message}`;
  }
}