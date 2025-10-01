const fs = require('fs').promises;
const path = require('path');

async function createStaticTable() {
  try {
    console.log('🔧 Creating static HTML table...');
    
    // Get all vocabulary files
    const vocabDir = path.join(process.cwd(), 'content', 'TU-KHAINIEM');
    const entries = await fs.readdir(vocabDir, { withFileTypes: true });
    
    const vocabularies = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '_index.md') {
        const indexPath = path.join(vocabDir, entry.name, '_index.md');
        try {
          const content = await fs.readFile(indexPath, 'utf8');
          const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
          const contentMatch = content.match(/## Khái Niệm\s*\n\s*(.+?)(?:\n\n|\n##|$)/s);
          
          if (titleMatch) {
            const title = titleMatch[1];
            const concept = contentMatch ? contentMatch[1].trim() : '';
            const preview = concept.substring(0, 10) + (concept.length > 10 ? '...' : '');
            
            vocabularies.push({
              title,
              slug: entry.name,
              preview
            });
          }
        } catch (error) {
          console.warn(`⚠️ Could not read ${entry.name}:`, error.message);
        }
      }
    }
    
    // Sort by title
    vocabularies.sort((a, b) => a.title.localeCompare(b.title));
    
    // Generate HTML table
    let html = `<div id="table-container">
  <table>
    <thead>
      <tr>
        <th>Từ vựng</th>
        <th>Khái niệm</th>
      </tr>
    </thead>
    <tbody>`;
    
    vocabularies.forEach(vocab => {
      html += `
      <tr>
        <td><a href="/tu-khainiem/${vocab.slug}/">${vocab.title}</a></td>
        <td>${vocab.preview}</td>
      </tr>`;
    });
    
    html += `
    </tbody>
  </table>
</div>

<style>
#table-container table {
  width: 100%;
  border-collapse: collapse;
}

#table-container th,
#table-container td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: top;
}

#table-container th:first-child,
#table-container td:first-child {
  width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#table-container th:last-child,
#table-container td:last-child {
  width: auto;
}

.pagination {
  margin-top: 12px;
  text-align: right;
}

.pagination button {
  background: #007bffa8;
  color: white;
  border: none;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.pagination button:hover {
  background: #0056b3;
}

.pagination span {
  margin: 0 8px;
  font-weight: bold;
  color: #333;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const table = document.querySelector("table");
  if (!table) return;
  
  const rows = Array.from(table.querySelectorAll("tr")).slice(1);
  const perPage = 10;
  let currentPage = 1;

  function renderTable(page) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = rows.slice(start, end);

    let html = "<table><tr>" + table.querySelector("tr").innerHTML + "</tr>";
    slice.forEach(r => html += "<tr>" + r.innerHTML + "</tr>");
    html += "</table>";

    const totalPages = Math.ceil(rows.length / perPage);
    html += \`<div class="pagination">
           <button onclick="jumpToPage(1)" title="Tua lên trang 1">⏮ Đầu</button>
           <button onclick="changePage(-1)">« Trước</button>
           <span>Trang \${page} / \${totalPages}</span>
           <button onclick="changePage(1)">Sau »</button>
           <button onclick="jumpToPage(\${totalPages})" title="Tua đến cuối trang">⏭ Cuối</button>
         </div>\`;

    document.getElementById("table-container").innerHTML = html;
  }

  window.changePage = function (delta) {
    const total = Math.ceil(rows.length / perPage);
    currentPage = Math.min(Math.max(1, currentPage + delta), total);
    renderTable(currentPage);
  };

  window.jumpToPage = function (page) {
    const total = Math.ceil(rows.length / perPage);
    currentPage = Math.min(Math.max(1, page), total);
    renderTable(currentPage);
  };

  table.style.display = "none";
  renderTable(currentPage);
});
</script>`;
    
    // Update _index.md
    const indexPath = path.join(process.cwd(), 'content', 'TU-KHAINIEM', '_index.md');
    const indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Replace shortcode with static HTML
    const updatedContent = indexContent.replace(
      /{{< vocabulary-table >}}/,
      html
    );
    
    await fs.writeFile(indexPath, updatedContent, 'utf8');
    console.log(`✅ Updated _index.md with ${vocabularies.length} vocabulary entries`);
    
  } catch (error) {
    console.error('❌ Error creating static table:', error);
  }
}

createStaticTable();
