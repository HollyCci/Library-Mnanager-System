<template>
  <n-space :vertical="true" :size="16">
    <n-gradient-text type="info" :size="16">
      <p>
        展示给管理员-套餐管理，每个租户都有套餐，如郑州校区租户和兰考校区租户拥有高校套餐，即可以实现改套餐的一些功能
      </p>
      <p>或添加进货套餐,即拥有进货套餐的租户仅拥有添加图书的功能</p>
      <p>租户套餐可向上一层管理租户的功能，降低系统耦合度</p>
    </n-gradient-text>
  </n-space>
</template>
