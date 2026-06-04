export interface Article {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  readTime: string
  tags: string[]
}

export const articles: Article[] = [
  {
    id: 'indie-developer-journey',
    title: '从零到一：我的独立开发之路',
    date: '2026-05-15',
    category: '创业心得',
    excerpt: '分享我从全职工作到独立开发者的转变历程，以及这一年来的收获与思考...',
    readTime: '8 分钟',
    tags: ['独立开发', '创业', '个人成长'],
    content: `# 从零到一：我的独立开发之路

## 为什么选择独立开发

2023年初，我做出了一个重要决定：离开稳定的工作，成为一名独立开发者。这个决定并非一时冲动，而是经过深思熟虑的结果。

在大公司工作的几年里，我积累了丰富的技术经验，参与了多个大型项目的开发。但随着时间推移，我越来越渴望更大的创作自由，想要打造真正属于自己的产品。

## 第一个产品的诞生

独立后的前三个月，我专注于开发第一款产品 TaskFlow。这是一个任务管理应用，灵感来源于我自己的需求。在开发过程中，我学到了很多：

### 技术选型

- 选择了 React Native，因为需要同时支持 iOS 和 Android
- 使用 Firebase 作为后端，快速实现功能
- 采用 TypeScript，提高代码质量

### 产品设计

最初的版本很简单，只有基础的任务管理功能。但我注重细节，确保每个交互都流畅自然。这种对用户体验的执着，后来成为产品的核心竞争力。

## 第一批用户

产品上线后，我通过 Product Hunt、Twitter 和技术社区进行推广。最初的用户增长很慢，第一周只有不到100个下载。

但我没有气馁，而是积极收集用户反馈，快速迭代。每当收到用户的建议，我都会认真考虑，尽快实现合理的需求。

## 突破与成长

三个月后，TaskFlow 的用户数突破了 1000。这个里程碑对我意义重大，证明了产品的价值。

随后的发展更加顺利：

- 6个月：5000 用户
- 1年：10000+ 用户
- 开始有稳定的收入来源

## 经验总结

这一年的独立开发经历让我收获颇丰：

1. **产品思维**：从用户需求出发，而不是技术驱动
2. **快速迭代**：先发布最小可行产品，再逐步完善
3. **持续学习**：独立开发者需要掌握全栈技能
4. **营销推广**：好产品也需要好的推广策略
5. **心态调整**：接受失败，从错误中学习

## 未来展望

未来，我计划继续深耕独立开发领域，推出更多有价值的产品。同时，我也希望通过写作和分享，帮助更多想要转型的开发者。

如果你也有独立开发的想法，欢迎与我交流！`
  },
  {
    id: 'vue3-composition-api',
    title: 'Vue 3 Composition API 完全指南',
    date: '2026-04-28',
    category: '技术教程',
    excerpt: '深入理解 Vue 3 Composition API 的核心概念和最佳实践...',
    readTime: '12 分钟',
    tags: ['Vue', 'JavaScript', '前端'],
    content: `# Vue 3 Composition API 完全指南

## 什么是 Composition API

Composition API 是 Vue 3 引入的一组基于函数的 API，它允许我们使用函数来组织组件逻辑，而不是选项对象。

## 为什么需要 Composition API

### 解决选项式 API 的痛点

1. **逻辑复用困难**：在选项式 API 中，逻辑分散在不同的选项中
2. **类型推断不足**：TypeScript 支持不够完善
3. **代码组织受限**：相关逻辑必须分散在不同部分

## 核心概念

### ref 和 reactive

\`ref\` 用于创建响应式的基本类型数据：

\`\`\`typescript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++
console.log(count.value) // 1
\`\`\`

\`reactive\` 用于创建响应式的对象：

\`\`\`typescript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})
\`\`\`

### computed

计算属性是基于它们的响应式依赖进行缓存的：

\`\`\`typescript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return \`\${firstName.value} \${lastName.value}\`
})
\`\`\`

### watch 和 watchEffect

\`watch\` 用于观察特定的响应式数据源：

\`\`\`typescript
import { ref, watch } from 'vue'

const count = ref(0)
watch(count, (newVal, oldVal) => {
  console.log(\`count changed from \${oldVal} to \${newVal}\`)
})
\`\`\`

\`watchEffect\` 会自动追踪依赖：

\`\`\`typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
watchEffect(() => {
  console.log(\`count is \${count.value}\`)
})
\`\`\`

## 最佳实践

### 逻辑复用

使用组合式函数来复用逻辑：

\`\`\`typescript
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
\`\`\`

### 代码组织

按功能组织代码，而不是按选项类型：

\`\`\`typescript
// 搜索相关逻辑
const searchQuery = ref('')
const searchResults = ref([])

// 分页相关逻辑
const currentPage = ref(1)
const pageSize = ref(10)
\`\`\`

## 总结

Composition API 为 Vue 带来了更灵活的代码组织方式和更好的类型支持。掌握它可以让你写出更优雅、更可维护的 Vue 代码。`
  },
  {
    id: 'react-native-performance',
    title: 'React Native 性能优化实战',
    date: '2026-04-15',
    category: '技术教程',
    excerpt: '分享在实际项目中遇到的性能问题和解决方案...',
    readTime: '10 分钟',
    tags: ['React Native', '性能', '移动端'],
    content: `# React Native 性能优化实战

## 性能问题的常见表现

在开发 React Native 应用时，我们经常会遇到以下性能问题：

1. **界面卡顿**：列表滚动不流畅
2. **启动时间长**：应用打开需要等待
3. **内存泄漏**：应用运行一段时间后崩溃
4. **帧率下降**：动画不流畅

## 列表优化

### 使用 FlatList 而非 ScrollView

FlatList 是高性能的列表组件，它会按需渲染可见的项：

\`\`\`jsx
<FlatList
  data={data}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={item => item.id}
/>
\`\`\`

### 优化 renderItem

确保 renderItem 返回的组件是纯组件：

\`\`\`jsx
const ListItem = React.memo(({ item }) => {
  return <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
})
\`\`\`

## 图片优化

### 使用合适的图片格式

- 对于图标，使用 SVG
- 对于照片，使用 WebP 格式
- 压缩图片大小

### 使用 FastImage

FastImage 是一个高性能的图片加载库：

\`\`\`jsx
import FastImage from 'react-native-fast-image'

<FastImage
  source={{
    uri: 'https://example.com/image.jpg',
    headers: { Authorization: 'someAuthToken' },
  }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.contain}
/>
\`\`\`

## 内存管理

### 清理定时器和监听器

在组件卸载时清理：

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    // do something
  }, 1000)
  
  return () => clearInterval(timer)
}, [])
\`\`\`

### 避免内存泄漏

确保正确处理异步操作：

\`\`\`jsx
useEffect(() => {
  let isMounted = true
  
  fetchData().then(data => {
    if (isMounted) {
      setData(data)
    }
  })
  
  return () => {
    isMounted = false
  }
}, [])
\`\`\`

## 总结

性能优化是一个持续的过程，需要不断地监测和改进。通过以上方法，可以显著提升 React Native 应用的性能。`
  },
  {
    id: 'product-design-principles',
    title: '产品设计的核心原则',
    date: '2026-03-20',
    category: '产品设计',
    excerpt: '分享我在产品设计过程中遵循的核心原则...',
    readTime: '6 分钟',
    tags: ['产品设计', '用户体验', '设计思维'],
    content: `# 产品设计的核心原则

## 用户至上

产品设计的核心是满足用户需求。始终从用户的角度思考问题：

1. 用户的真实需求是什么？
2. 用户在什么场景下使用产品？
3. 用户遇到的痛点是什么？

## 简洁至上

简单的产品更容易被用户接受：

- 去掉不必要的功能
- 简化操作流程
- 使用清晰的视觉层级

## 一致性

保持设计的一致性可以降低用户的学习成本：

- 使用统一的设计语言
- 保持交互模式一致
- 统一的视觉风格

## 反馈及时

及时的反馈可以让用户知道操作的结果：

- 按钮点击后的状态变化
- 加载状态的提示
- 操作成功或失败的反馈

## 容错设计

考虑用户可能的错误操作：

- 提供撤销功能
- 清晰的错误提示
- 友好的引导

## 可访问性

确保产品对所有用户都可用：

- 支持键盘导航
- 提供屏幕阅读器支持
- 合理的对比度和字体大小

## 总结

好的产品设计需要在功能、体验和美学之间找到平衡。遵循这些原则，可以帮助你创建更优秀的产品。`
  },
  {
    id: 'git-workflow-best-practices',
    title: 'Git 工作流最佳实践',
    date: '2026-03-10',
    category: '开发工具',
    excerpt: '分享团队协作中高效的 Git 工作流...',
    readTime: '5 分钟',
    tags: ['Git', '团队协作', '版本控制'],
    content: `# Git 工作流最佳实践

## 分支策略

### Git Flow

这是一个经典的分支模型：

- \`main\`：主分支，存放稳定代码
- \`develop\`：开发分支，集成所有功能
- \`feature/*\`：功能分支，开发新功能
- \`release/*\`：发布分支，准备发布
- \`hotfix/*\`：紧急修复分支

### Trunk Based Development

适合持续集成的简单模型：

- \`main\`：唯一的长期分支
- 功能通过短生命周期的特性分支开发

## 提交规范

### 使用约定式提交

格式：\`<type>(<scope>): <description>\`

常见类型：
- \`feat\`：新功能
- \`fix\`：修复 bug
- \`docs\`：文档更新
- \`style\`：代码格式
- \`refactor\`：重构
- \`test\`：测试
- \`chore\`：构建/工具更新

示例：\`feat(auth): add login with Google\`

### 保持提交粒度适中

- 每个提交应该是一个独立的逻辑单元
- 避免超大提交
- 避免过于琐碎的提交

## 代码审查

### PR 审查流程

1. 创建 PR 时提供清晰的描述
2. 添加相关的测试
3. 至少需要一个 reviewer 批准
4. 使用 CI/CD 自动检查

### 审查要点

- 代码正确性
- 代码质量
- 性能考虑
- 安全性
- 可维护性

## 总结

选择适合团队的工作流，并坚持执行，可以显著提高团队的协作效率。`
  },
  {
    id: 'typescript-tips',
    title: 'TypeScript 实用技巧',
    date: '2026-02-25',
    category: '技术教程',
    excerpt: '分享日常开发中常用的 TypeScript 技巧...',
    readTime: '7 分钟',
    tags: ['TypeScript', '前端', '编程技巧'],
    content: `# TypeScript 实用技巧

## 类型推断

### 类型守卫

使用类型守卫来缩小类型范围：

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
\`\`\`

### 类型断言

使用 \`as\` 进行类型断言：

\`\`\`typescript
const element = document.getElementById('my-element') as HTMLElement
\`\`\`

## 高级类型

### 泛型

创建可重用的泛型函数：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}
\`\`\`

### 条件类型

根据条件选择类型：

\`\`\`typescript
type IsString<T> = T extends string ? true : false
\`\`\`

### 映射类型

基于现有类型创建新类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
\`\`\`

## 工具类型

### Partial

使所有属性变为可选：

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

### Pick

选择指定的属性：

\`\`\`typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
\`\`\`

### Omit

排除指定的属性：

\`\`\`typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
\`\`\`

## 总结

掌握这些 TypeScript 技巧可以让你写出更类型安全、更优雅的代码。`
  }
]