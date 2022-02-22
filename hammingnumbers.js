function hamming (n) {
// For this problem, we can use 'queues' to reduce computation time required.
// Queues are a FIRST ON, LAST OFF data structure - the first item put onto the queue will always be the last item taken off.
// Javascript arrays can function as a queue by using the push method to put items ON,
// and shift to take items OFF. You could also use unshift and pop for the same effect.
    const queues = {2:[],3:[],5:[]}
    // we use three queues here since we know, for each base X, each respective hamming number multiplied by base X will be higher than than all previous. 
    // We CANNOT say this if we were adding all hamming numbers to the same queue - the FIRST ON, LAST OFF procedure wouldn't guarantee access to the next lowest Ham.
    // n.b. Maybe you could use a single queue and just search for the next Lowest Ham from the start of the array each time? Probably would still be pretty fast.

    // There is a shortcoming of using a queue like this. We can't guarantee that we're not doubling up on hamming numbers. The plan it to just iteratively add them to the
    // queues, but e.g. we might add 6 twice - once when multiplying the hamming number 2 by 3, and again when multiplying 3 by 2. Using a hash is a computation efficient way
    // of keeping track of previous results - if we stored the previous values on an array, we'd need to search for it every time. N.b. I think it might be possible to basically turn
    // a JS array into a hash by changing it's index values from the usual 0 - N, but just the standard JS object works fine here as a hash map.

    const hash = {1:true}
    // First hamming number is already added to the hash.

    let lowestHam = 1
    

// The job of this function is to make sure we always take the next lowest Ham from the queues. It stores the currentLowest (starts as the '0' item),
// updating it if it finds a lower value as it checks each queue.
    function getCurrentLowestHam() {
    let prospectiveLowest = queues[2][0]
    let queueWeWillTakeFrom = queues[2]
    if (queues[3][0] < prospectiveLowest) {
        prospectiveLowest = queues[3][0]
        queueWeWillTakeFrom = queues[3]
      }
    if (queues[5][0] < prospectiveLowest){
        queueWeWillTakeFrom = queues[5]
    }
      return queueWeWillTakeFrom.shift()
    }
    
    
// The i for-loop iteratively finds the next hamming number N
    for (let i=1; i < n; i++) {
        // The for-in loop iteratively calculates the next three possible hamming numbers
        for (const base in queues) {
          let hamming = lowestHam * base
          // It is only the unique numbers, those not already in the hashmap, that are added to a queue
          if (!(hash[`${hamming}`])) {queues[base].push(hamming);
          // Then we add it to the hash
          hash[`${hamming}`] = true
        }
        }
      lowestHam = getCurrentLowestHam(queues)
    }
    return lowestHam
  }
