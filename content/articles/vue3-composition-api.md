---
id: vue3-composition-api
title: Vue 3 Composition API 完全指南
date: 2026-04-28
category: 技术教程
readTime: 12 分钟
tags:
  - Vue
  - JavaScript
  - 前端
---

# Vue 3 Composition API 完全指南

## 什么是 Composition API

Composition API 是 Vue 3 引入的一组基于函数的 API，它允许我们使用函数来组织组件逻辑，而不是选项对象。

## 为什么需要 Composition API

### 解决选项式 API 的痛点

1. **逻辑复用困难**：在选项式 API 中，逻辑分散在不同的选项中
2. **类型推断不足**：TypeScript 支持不够完善
3. **代码组织受限**：相关逻辑必须分散在不同部分

## 核心概念

### ref 和 reactive

`ref` 用于创建响应式的基本类型数据：

```typescript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++
console.log(count.value) // 1
```

`reactive` 用于创建响应式的对象：

```typescript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})
```

### computed

计算属性是基于它们的响应式依赖进行缓存的：

```typescript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
```

### watch 和 watchEffect

`watch` 用于观察特定的响应式数据源：

```typescript
import { ref, watch } from 'vue'

const count = ref(0)
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})
```

`watchEffect` 会自动追踪依赖：

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
watchEffect(() => {
  console.log(`count is ${count.value}`)
})
```

## 最佳实践

### 逻辑复用

使用组合式函数来复用逻辑：

```typescript
// useCounter.ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

### 代码组织

按功能组织代码，而不是按选项类型：

```typescript
// 搜索相关逻辑
const searchQuery = ref('')
const searchResults = ref([])

// 分页相关逻辑
const currentPage = ref(1)
const pageSize = ref(10)
```

## 总结

Composition API 为 Vue 带来了更灵活的代码组织方式和更好的类型支持。掌握它可以让你写出更优雅、更可维护的 Vue 代码。