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

// テーブルを生成して表示する関数
async function loadTableJson() {
  const container = document.getElementById('tableContainer');
  if (!container) return;
  container.textContent = '読み込み中...';

  try {
    const response = await fetch(`${API_URL}/records`);
    const tableData = await response.json();

    if (tableData.length === 0) {
      container.textContent = 'データがありません。';
      return;
    }

    // テーブルのHTMLを組み立てる
    let tableHtml = `
      <table class="record-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Player ID</th>
            <th>距離</th>
            <th>記録</th>
            <th>走った日</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
    `;

    tableData.forEach(row => {
      // ★ サーバー（SQLの結合）から届いた distance_value をそのまま使う
      // 画面で見やすいように後ろに 「m」 をつけています
      const distanceDisplay = row.distance_value ? `${row.distance_value}m` : `ID: ${row.distance_id}`;

      tableHtml += `
        <tr>
          <td>${row.id}</td>
          <td>${row.player_id}</td>
          <td>${distanceDisplay}</td> <td>${row.record}</td>
          <td>${row.run_date ? row.run_date.substring(0, 10) : ''}</td>
          <td>${row.notes || ''}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    container.innerHTML = tableHtml;

  } catch (error) {
    container.textContent = `エラー: ${error.message}`;
  }
}

async function insertRecord(event) {
  event.preventDefault();

 /* const pre = document.getElementById('tableJson');
  if (!pre) return;*/

  // const id = document.getElementById('id').value
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
      body: JSON.stringify({ player_id, distance_id, record, run_date, notes })
    });
    
    const data = await response.json();
    console.log("data", data)
    /* pre.textContent = JSON.stringify(data, null, 2); */

    await loadTableJson();
  } catch (error) {
    /* pre.textContent = `エラー: ${error.message}`; */
  }
}


//ここからまだ理解していません
async function deletePlayer(event) {
  event.preventDefault();

 // const pre = document.getElementById('tableJson');
  const record_id = document.getElementById('deleteId').value;

  if (!record_id) {
    alert('削除するレコードのIDを入力してください。');
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

    /* pre.textContent =
      `削除成功\n${JSON.stringify(data, null, 2)}`; */

    await loadTableJson();

  } catch (error) {
    /* pre.textContent = `エラー: ${error.message}`; */
    alert(`エラー: ${error.message}`);
  }
}