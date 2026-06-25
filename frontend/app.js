const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('showJson');
  if (btn) btn.addEventListener('click', loadTableJson);

  const form = document.getElementById('recordForm');
  if (form) form.addEventListener('submit', insertRecord);

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

async function insertRecord(event) {
  event.preventDefault();
/*
  const pre = document.getElementById('tableJson');
  if (!pre) return;
*/
  const id = document.getElementById('id').value
  const player_id = document.getElementById('player_id').value
  const distance_id = document.getElementById('distance_id').value
  const record = document.getElementById('record').value
  const run_date = document.getElementById('run_date').value
  const notes = document.getElementById('notes').value
/*
  pre.textContent = '送信中...';
*/
  try {//フロントからバック、バックからフロンt、どっちもやってる
    const response = await fetch(`${API_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, player_id, distance_id, record, run_date, notes })
    });
    
    const data = await response.json();
    console.log("data", data)
    pre.textContent = JSON.stringify(data, null, 2);

    await loadTableJson();
  } catch (error) {
    pre.textContent = `エラー: ${error.message}`;
  }
}


//ここからまだ理解していません
async function deletePlayer(event) {
  event.preventDefault();

  const pre = document.getElementById('tableJson');
  const record_id = document.getElementById('deleteId').value;

  if (!record_id) {
    pre.textContent = 'record_idを入力してください';
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/records/${record_id}`,
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