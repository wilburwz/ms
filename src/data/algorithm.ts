import type { KnowledgePoint } from '../types'

export const algorithmData: KnowledgePoint[] = [
  {
    id: "alg-01",
    title: "常见排序算法对比",
    category: "algorithm",
    difficulty: 2,
    question: "请对比常见排序算法的时间复杂度、空间复杂度和稳定性。",
    answer: '前端需要算法吗？业务逻辑里确实不需要天天写红黑树，但理解基础的数据结构和复杂度能帮你做出更好的工程决策。比如一个搜索框输入防抖——你知道为什么用防抖而不是每次输入都请求吗？因为后端扛不住。如果能用 Map 做 O(1) 查找而不是用 Array 做 O(n) 查找，性能差距很大。这就是算法素养在前端工程里的价值——不是炫技，是避免写低效代码。',
    codeExample: "// 快速排序\nfunction quickSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr\n  const pivot = arr[Math.floor(arr.length / 2)]\n  const left = arr.filter(x => x < pivot)\n  const mid = arr.filter(x => x === pivot)\n  const right = arr.filter(x => x > pivot)\n  return [...quickSort(left), ...mid, ...quickSort(right)]\n}",
    tags: ["算法", "排序", "快排", "归并"],
  },
  {
    id: "alg-02",
    title: "二分查找与变体",
    category: "algorithm",
    difficulty: 1,
    question: "二分查找的实现和常见变体？",
    answer: '时间复杂度和空间复杂度用来描述算法的效率。O(1) 是常数时间——不管数据多大都一样快，O(n) 是线性增长，O(n^2) 是指数级增长（数据翻倍时间翻四倍）。前端里最常见的 O(n) 场景在数组遍历——find、filter、map 都是 O(n)。O(n^2) 在嵌套循环里——两个嵌套 forEach 就是 O(n^2)。实际意义：数据量 100 时 O(n^2) 可能还行，数据量 10000 的时候就明显卡了。',
    codeExample: "function binarySearch(nums: number[], target: number): number {\n  let left = 0, right = nums.length - 1\n  while (left <= right) {\n    const mid = left + ((right - left) >> 1)\n    if (nums[mid] === target) return mid\n    if (nums[mid] < target) left = mid + 1\n    else right = mid - 1\n  }\n  return -1\n}",
    tags: ["算法", "二分查找", "搜索"],
  },
  {
    id: "alg-03",
    title: "DFS 与 BFS",
    category: "algorithm",
    difficulty: 2,
    question: "深度优先搜索和广度优先搜索的实现与适用场景？",
    answer: '数组扁平化的几种方法。flat(depth) 最直接——arr.flat(Infinity) 完全拍平。递归方案——遍历数组每项，是数组就递归拍平，不是就 push。reduce 方案——arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), [])。栈方案——用栈模拟递归避免爆栈，适合层级特别深的数组。实际项目里 flat() 早就够用了，手写只是为了面试。',
    codeExample: "// DFS - 递归\nfunction dfs(node: TreeNode) {\n  if (!node) return\n  console.log(node.val)\n  dfs(node.left)\n  dfs(node.right)\n}\n\n// BFS - 队列\nfunction bfs(root: TreeNode) {\n  const queue = [root]\n  while (queue.length) {\n    const node = queue.shift()!\n    console.log(node.val)\n    if (node.left) queue.push(node.left)\n    if (node.right) queue.push(node.right)\n  }\n}",
    tags: ["算法", "DFS", "BFS", "搜索"],
  },
  {
    id: "alg-04",
    title: "动态规划解题思路",
    category: "algorithm",
    difficulty: 3,
    question: "动态规划的解题步骤？常见题型？",
    answer: 'DFS（深度优先）和 BFS（广度优先）的选择：DFS 用栈（递归），沿着一条路走到头再回来试另一条。适合找"是否存在某条路径"。BFS 用队列，一层一层向外扩展。适合找"最短路径"。前端场景：DOM 树的遍历本身就是 DFS（深度遍历子节点）。菜单树的展开用 BFS 更合理——因为用户关心的是当前层级有哪些，BFS 一层一层加载体验更好。',
    codeExample: "// 爬楼梯\ndp[i] = dp[i-1] + dp[i-2]\nfunction climbStairs(n: number): number {\n  if (n <= 2) return n\n  let prev2 = 1, prev1 = 2\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2\n    prev2 = prev1\n    prev1 = curr\n  }\n  return prev1\n}\n\n// 最长递增子序列\ndp[i] = max(dp[j] + 1) for j < i and nums[j] < nums[i]",
    tags: ["算法", "动态规划", "DP", "状态转移"],
  },
  {
    id: "alg-05",
    title: "链表常见操作",
    category: "algorithm",
    difficulty: 2,
    question: "链表的常见面试题有哪些？解题技巧？",
    answer: '排序算法不用手写，但要知道适用场景。Array.sort() 是浏览器内置的——Chrome V8 用 Timsort（插入+归并的混合），时间复杂度 O(n log n)。冒泡排序 O(n^2) 太慢只适合面试。快速排序平均 O(n log n) 但最差 O(n^2)。如果面试让手写排序，写快排或者归并就行。前端实际场景中，需要排序的数据量通常不大——几百到几千条，Array.sort() 足够快。',
    codeExample: "// 反转链表\nfunction reverseList(head: ListNode): ListNode {\n  let prev = null, curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}\n\n// 环检测\nfunction hasCycle(head: ListNode): boolean {\n  let slow = head, fast = head\n  while (fast?.next) {\n    slow = slow.next\n    fast = fast.next.next\n    if (slow === fast) return true\n  }\n  return false\n}",
    tags: ["算法", "链表", "快慢指针", "双指针"],
  }
]
