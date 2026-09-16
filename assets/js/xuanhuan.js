/**
 * 《愿力纠察使》页面专属交互：术语表搜索与分类筛选
 */
(function () {
  'use strict';

  var grid = document.getElementById('glossary-grid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.g-item'));
  var input = document.getElementById('glossary-search');
  var filters = Array.prototype.slice.call(document.querySelectorAll('.g-filter'));
  var countEl = document.getElementById('g-count');
  var emptyEl = document.getElementById('g-empty');

  var currentCat = 'all';

  if (countEl) countEl.textContent = items.length;

  function apply() {
    var keyword = (input && input.value ? input.value : '').trim().toLowerCase();
    var shown = 0;

    items.forEach(function (item) {
      var matchCat = currentCat === 'all' || item.getAttribute('data-cat') === currentCat;
      var matchWord = !keyword || item.textContent.toLowerCase().indexOf(keyword) > -1;
      var visible = matchCat && matchWord;

      item.classList.toggle('is-hidden', !visible);
      if (visible) {
        // 已由 main.js 的 IntersectionObserver 处理过滚动显现，
        // 这里补上 .in-view 以免筛选后残留初始的隐藏状态
        item.classList.add('in-view');
        shown++;
      }
    });

    if (countEl) countEl.textContent = shown;
    if (emptyEl) emptyEl.hidden = shown > 0;
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      currentCat = btn.getAttribute('data-cat');
      apply();
    });
  });

  if (input) {
    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(apply, 120);
    });
  }
})();
