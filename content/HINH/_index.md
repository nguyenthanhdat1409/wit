---
title: "Hình ảnh - Đồ hình"
description: ""
date: 2025-09-23
draft: false
weight: 1
---

<style>
.image-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
  max-width: 100%;
}

 .image-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* đẩy nút xuống cuối */
  height: 100%; /* card cao bằng nhau */
  border: 1px solid #fff; /* đổi viền trắng */
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  text-align: center;
}


.image-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #fff;
  padding: 10px;
  display: block;
  margin: 0 auto;
}

.image-card p {
  min-height: 48px; /* tạo chiều cao đồng nhất cho text */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.image-card .buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  flex-direction: row;
}

.image-card .buttons a {
  background: #007bff;
  color: #fff;
  padding: 5px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  flex: 1;
  max-width: 120px;
  text-align: center;
  font-weight: 500;
}

.image-card .buttons a:last-child {
  background: #28a745;
}

/* Tablet - 2 cột */
@media (min-width: 768px) {
  .image-grid {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .image-card {
    flex: 1 1 calc(50% - 6px);
    max-width: calc(50% - 6px);
  }
}

/* Desktop - 3 cột */
@media (min-width: 1024px) {
  .image-card {
    flex: 1 1 calc(33.333% - 8px);
    max-width: calc(33.333% - 8px);
  }
}

/* Large Desktop - 4 cột */
@media (min-width: 1200px) {
  .image-card {
    flex: 1 1 calc(25% - 9px);
    max-width: calc(25% - 9px);
  }
}

/* Extra small mobile */
@media (max-width: 480px) {
  .image-grid {
    padding: 0 4px;
    gap: 12px;
  }
  
  .image-card {
    padding: 10px;
  }
  
  .image-card img {
    height: 180px;
    padding: 8px;
  }
  
  .image-card p {
    font-size: 15px;
    margin: 10px 0;
  }
  
  .image-card .buttons {
    gap: 10px;
    margin-top: 10px;
  }
  
  .image-card .buttons a {
    padding: 8px 16px;
    font-size: 13px;
    max-width: 100px;
  }
}
</style>

<div class="image-grid" id="imageGrid">
  <!-- Dữ liệu sẽ được load từ API WordPress -->
  </div>

<script src="/js/dohinh-api.js"></script>