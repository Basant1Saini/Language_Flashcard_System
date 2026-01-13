// Data Structures & Algorithms implementation for Spaced Repetition
class SpacedRepetitionDSA {
  constructor() {
    // Priority Queue implementation using Min Heap for due cards
    this.dueCardsHeap = new MinHeap((a, b) => 
      new Date(a.nextReview) - new Date(b.nextReview)
    )
    
    // Hash Map for O(1) card lookup
    this.cardMap = new Map()
    
    // Trie for efficient search functionality
    this.searchTrie = new Trie()
  }

  // Add card to the system
  addCard(card) {
    this.cardMap.set(card.id, card)
    this.dueCardsHeap.insert(card)
    this.searchTrie.insert(card.front.text.toLowerCase(), card.id)
  }

  // Get cards due for review using heap
  getDueCards(limit = 20) {
    const dueCards = []
    const now = new Date()
    
    while (dueCards.length < limit && !this.dueCardsHeap.isEmpty()) {
      const card = this.dueCardsHeap.peek()
      if (new Date(card.nextReview) <= now) {
        dueCards.push(this.dueCardsHeap.extract())
      } else {
        break
      }
    }
    
    return dueCards
  }

  // Update card after review and reinsert into heap
  updateCardAfterReview(cardId, quality, responseTime) {
    const card = this.cardMap.get(cardId)
    if (!card) return null

    // SM-2 Algorithm implementation
    const sr = card.spacedRepetition
    
    if (quality >= 3) {
      if (sr.repetitions === 0) {
        sr.interval = 1
      } else if (sr.repetitions === 1) {
        sr.interval = 6
      } else {
        sr.interval = Math.round(sr.interval * sr.easeFactor)
      }
      sr.repetitions++
    } else {
      sr.repetitions = 0
      sr.interval = 1
    }
    
    // Update ease factor
    sr.easeFactor = Math.max(1.3, 
      sr.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )
    
    // Calculate next review date
    sr.nextReview = new Date(Date.now() + sr.interval * 24 * 60 * 60 * 1000)
    
    // Update stats
    card.stats.timesReviewed++
    card.stats.lastReviewed = new Date()
    card.stats.averageResponseTime = this.updateAverageResponseTime(
      card.stats.averageResponseTime,
      card.stats.timesReviewed,
      responseTime
    )

    // Reinsert into heap with new review date
    this.dueCardsHeap.insert(card)
    
    return card
  }

  // Search cards using Trie for efficient prefix matching
  searchCards(query, limit = 10) {
    const cardIds = this.searchTrie.search(query.toLowerCase())
    return cardIds.slice(0, limit).map(id => this.cardMap.get(id))
  }

  // Get learning statistics using efficient algorithms
  getStatistics() {
    const cards = Array.from(this.cardMap.values())
    
    return {
      totalCards: cards.length,
      dueCards: this.getDueCards(Infinity).length,
      masteredCards: cards.filter(card => 
        card.spacedRepetition.repetitions >= 3 && 
        card.spacedRepetition.easeFactor >= 2.5
      ).length,
      averageEaseFactor: this.calculateAverage(
        cards.map(card => card.spacedRepetition.easeFactor)
      ),
      retentionRate: this.calculateRetentionRate(cards)
    }
  }

  // Helper method to update average response time
  updateAverageResponseTime(currentAvg, totalReviews, newTime) {
    return ((currentAvg * (totalReviews - 1)) + newTime) / totalReviews
  }

  // Calculate average of array
  calculateAverage(numbers) {
    return numbers.length > 0 ? 
      numbers.reduce((sum, num) => sum + num, 0) / numbers.length : 0
  }

  // Calculate retention rate
  calculateRetentionRate(cards) {
    const reviewedCards = cards.filter(card => card.stats.timesReviewed > 0)
    if (reviewedCards.length === 0) return 0
    
    const correctReviews = reviewedCards.reduce((sum, card) => 
      sum + card.stats.correctCount, 0)
    const totalReviews = reviewedCards.reduce((sum, card) => 
      sum + card.stats.timesReviewed, 0)
    
    return totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0
  }
}

// Min Heap implementation for priority queue
class MinHeap {
  constructor(compareFn) {
    this.heap = []
    this.compare = compareFn || ((a, b) => a - b)
  }

  insert(value) {
    this.heap.push(value)
    this.bubbleUp(this.heap.length - 1)
  }

  extract() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()
    
    const min = this.heap[0]
    this.heap[0] = this.heap.pop()
    this.bubbleDown(0)
    return min
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null
  }

  isEmpty() {
    return this.heap.length === 0
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break
      
      this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  bubbleDown(index) {
    while (true) {
      let minIndex = index
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      
      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[minIndex]) < 0) {
        minIndex = leftChild
      }
      
      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[minIndex]) < 0) {
        minIndex = rightChild
      }
      
      if (minIndex === index) break
      
      this.swap(index, minIndex)
      index = minIndex
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }
}

// Trie implementation for efficient search
class TrieNode {
  constructor() {
    this.children = new Map()
    this.cardIds = new Set()
    this.isEndOfWord = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word, cardId) {
    let node = this.root
    
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)
      node.cardIds.add(cardId)
    }
    
    node.isEndOfWord = true
  }

  search(prefix) {
    let node = this.root
    
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return []
      }
      node = node.children.get(char)
    }
    
    return Array.from(node.cardIds)
  }
}

export default SpacedRepetitionDSA