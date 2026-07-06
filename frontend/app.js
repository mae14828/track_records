const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  // Initial data load
  loadRecords();
  loadPlayers();
});

// ==================== RECORDS FUNCTIONS ====================

// Load and display records
async function loadRecords() {
  const container = document.getElementById('recordTableContainer');
  if (!container) return;
  
  container.textContent = '読み込み中...';

  try {
    const [recordsResponse, playersResponse] = await Promise.all([
      fetch(`${API_URL}/records`),
      fetch(`${API_URL}/players`)
    ]);

    if (!recordsResponse.ok) {
      throw new Error('記録の取得に失敗しました');
    }

    if (!playersResponse.ok) {
      throw new Error('選手情報の取得に失敗しました');
    }

    const records = await recordsResponse.json();
    const players = await playersResponse.json();
    const playerMap = new Map(players.map(p => [String(p.player_id), p]));

    if (records.length === 0) {
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
            <th>日付</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
    `;

    records.forEach(record => {
      const player = playerMap.get(String(record.player_id)) || {};
      const distance = record.distance_value ? `${record.distance_value}m` : `ID:${record.distance_id}`;

      tableHtml += `
        <tr>
          <td>${record.id}</td>
          <td>${player.player_name || '不明'}</td>
          <td>${player.gender || '-'}</td>
          <td>${distance}</td>
          <td>${record.record}</td>
          <td>${record.run_date ? record.run_date.substring(0, 10) : ''}</td>
          <td>${record.notes || ''}</td>
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

  const playerId = document.getElementById('recordPlayerId').value;
  const distanceId = document.getElementById('distanceId').value;
  const recordTime = document.getElementById('recordTime').value;
  const runDate = document.getElementById('runDate').value;
  const notes = document.getElementById('recordNotes').value;

  try {
    const response = await fetch(`${API_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: playerId,
        distance_id: distanceId,
        record: recordTime,
        run_date: runDate,
        notes: notes
      })
    });

    if (!response.ok) {
      throw new Error('記録の追加に失敗しました');
    }

    alert('記録を追加しました');
    document.getElementById('recordForm').reset();
    loadRecords();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

// Delete record
async function deleteRecord(event) {
  event.preventDefault();

  const recordId = document.getElementById('deleteRecordId').value;

  if (!recordId) {
    alert('削除する記録のIDを入力してください');
    return;
  }

  if (!confirm('この記録を削除してもよろしいですか？')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/records/${recordId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('記録の削除に失敗しました');
    }

    alert('記録を削除しました');
    document.getElementById('deleteRecordForm').reset();
    loadRecords();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

// ==================== PLAYERS FUNCTIONS ====================

// Load and display players
async function loadPlayers() {
  const container = document.getElementById('playerTableContainer');
  if (!container) return;

  container.textContent = '読み込み中...';

  try {
    const response = await fetch(`${API_URL}/players`);

    if (!response.ok) {
      throw new Error('選手情報の取得に失敗しました');
    }

    const players = await response.json();

    if (players.length === 0) {
      container.textContent = 'データがありません。';
      return;
    }

    let tableHtml = `
      <table class="record-table">
        <thead>
          <tr>
            <th>選手ID</th>
            <th>選手名</th>
            <th>性別</th>
          </tr>
        </thead>
        <tbody>
    `;

    players.forEach(player => {
      tableHtml += `
        <tr>
          <td>${player.player_id}</td>
          <td>${player.player_name}</td>
          <td>${player.gender}</td>
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

// Insert new player
async function insertPlayer(event) {
  event.preventDefault();

  const playerId = document.getElementById('newPlayerId').value;
  const playerName = document.getElementById('newPlayerName').value;
  const gender = document.getElementById('newPlayerGender').value;

  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: playerId,
        player_name: playerName,
        gender: gender
      })
    });

    if (!response.ok) {
      throw new Error('選手の追加に失敗しました');
    }

    alert('選手を追加しました');
    document.getElementById('playerForm').reset();
    loadPlayers();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

// Delete player
async function deletePlayer(event) {
  event.preventDefault();

  const playerId = document.getElementById('deletePlayerId').value;

  if (!playerId) {
    alert('削除する選手のIDを入力してください');
    return;
  }

  if (!confirm('この選手を削除してもよろしいですか？')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('選手の削除に失敗しました');
    }

    alert('選手を削除しました');
    document.getElementById('deletePlayerForm').reset();
    loadPlayers();

  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}