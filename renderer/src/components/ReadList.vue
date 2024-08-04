<script setup lang="ts">

</script>

<template>
<div class="read-list">
  <mdui-card variant="elevated" class="mdui-pose">
    <div class="article-card">
      <div class="article-info-container">
        <div class="article-time-info">
          <p>4 days ago</p>
          <mdui-divider vertical></mdui-divider>
          <p>Required time</p>
        </div>
        <a href="" target="_blank">
          <h1>Article Title</h1>
        </a>
        <div class="article-detail">
          <p>BBC News</p>
          <mdui-divider vertical></mdui-divider>
          <p>Article description</p>
        </div>
      </div>
      <mdui-button class="mark-readed">Readed</mdui-button>
    </div>
  </mdui-card>
</div>
</template>

<style scoped>
mdui-divider {
  height: .8rem;
}

.read-list {
  display: flex;
  flex-direction: column;
  gap: .6rem;
  padding: 1rem 2rem;
}

.article-card {
  display: flex;
  align-items: center;
  padding: .6rem 1rem;

  h1 {
    display: inline;
    margin: 0;
  }
  .add-date {
    margin: 0;
  }
  .article-info-container {
    flex: 1;
  }
  .article-time-info {
    display: flex;
    align-items: center;
    gap: .4rem;

    p {
      margin: 0;
      font-size: 0.875rem;
    }
  }
  .article-detail {
    display: flex;
    align-items: center;
    gap: .4rem;

    p {
      margin: .2rem 0 0;
      font-size: 0.875rem;
    }
  }
}

.mark-readed {
  --shape-corner: var(--mdui-shape-corner-medium);
}
</style>
