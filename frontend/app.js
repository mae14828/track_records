const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('showJson');
  if (btn) btn.addEventListener('click', loadTableJson);

  const form = document.getElementById('recordForm');
  if (form) form.addEventListener('submit', insertRecord);

  loadTableJson();

  const playerForm = document.getElementById("playerForm");
  if (playerForm) playerForm.addEventListener("submit", insertPlayer);

  loadPlayers();
});

// テーブルを生成して表示する関数
async function loadTableJson() {
  const container = document.getElementById('tableContainer');
  if (!container) return;
  container.textContent = '読み込み中...';

  try {
    const [recordsResponse, playersResponse] = await Promise.all([
      fetch(`${API_URL}/records`),
      fetch(`${API_URL}/players`)
    ]);

    if (!recordsResponse.ok) {
      throw new Error('recordsの取得に失敗しました');
    }

    if (!playersResponse.ok) {
      throw new Error('playersの取得に失敗しました');
    }

    const tableData = await recordsResponse.json();
    const players = await playersResponse.json();
    const playerMap = new Map(players.map(player => [String(player.player_id), player]));

    if (tableData.length === 0) {
      container.textContent = 'データがありません。';
      return;
    }

    let tableHtml = `
      <table class="record-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>選手名</th>
            <th>性別</th>
            <th>距離</th>
            <th>記録</th>
            <th>走った日</th>
            <th>備考</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
    `;

    tableData.forEach(row => {
      const player = playerMap.get(String(row.player_id)) || {};
      const distanceDisplay = row.distance_value ? `${row.distance_value}m` : `ID: ${row.distance_id}`;

      tableHtml += `
        <tr>
          <td>${row.id}</td>
          <td>${player.player_name || '不明'}</td>
          <td>${player.gender || '-'}</td>
          <td>${distanceDisplay}</td>
          <td>${row.record}</td>
          <td>${row.run_date ? row.run_date.substring(0, 10) : ''}</td>
          <td>${row.notes || ''}</td>
          <td>
            <button class="delete-record-btn" data-id="${row.id}" style="cursor: pointer; padding: 4px 8px; background-color: #ff6b6b; color: white; border: none; border-radius: 4px;">削除</button>
          </td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    container.innerHTML = tableHtml;

    // 削除ボタンのイベントリスナーを追加
    document.querySelectorAll('.delete-record-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm(`削除しますか？`)) {
          await deleteRecordFromTable(id);
        }
      });
    });

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

// プレイヤー一覧を取得して表示する関数
async function loadPlayers() {

  const container = document.getElementById("playerTableContainer");

  const response = await fetch(`${API_URL}/players`);
  const players = await response.json();

  let html = `
  <table class="record-table">
    <thead>
      <tr>
        <th>player_id</th>
        <th>player_name</th>
        <th>gender</th>
        <th>削除</th>
      </tr>
    </thead>
    <tbody>
  `;

  players.forEach(player => {
    html += `
      <tr>
        <td>${player.player_id}</td>
        <td>${player.player_name}</td>
        <td>${player.gender}</td>
        <td>
          <button class="delete-player-btn" data-player-id="${player.player_id}" style="cursor: pointer; padding: 4px 8px; background-color: #ff6b6b; color: white; border: none; border-radius: 4px;">削除</button>
        </td>
      </tr>
    `;
  });

  html += `
    </tbody>
  </table>`;

  container.innerHTML = html;

  // 削除ボタンのイベントリスナーを追加
  document.querySelectorAll('.delete-player-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const playerId = e.target.getAttribute('data-player-id');
      if (confirm(`player_id ${playerId} を削除しますか？`)) {
        await deletePlayerFromTable(playerId);
      }
    });
  });
}
// プレイヤーを追加する関数
async function insertPlayer(event){

  event.preventDefault();

  const player_id = document.getElementById("player_id_input").value;
  const player_name = document.getElementById("player_name").value;
  const gender = document.getElementById("gender").value;

  await fetch(`${API_URL}/players`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      player_id,
      player_name,
      gender
    })
  });

  loadPlayers();

  event.target.reset();
}


// テーブルの削除ボタンから呼ばれる削除関数
async function deleteRecordFromTable(record_id) {
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

    alert('レコードが削除されました。');
    await loadTableJson();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}


// プレイヤーを削除する関数
async function deletePlayerFromTable(player_id) {
  try {
    const response = await fetch(
      `${API_URL}/players/${player_id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '削除失敗');
    }

    alert('選手が削除されました。');
    await loadPlayers();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}