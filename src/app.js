
const expiryDates = {}
const defaults = {
    fetchData: {},
    setToContext: false,
  };

const middleware = (opts = {}) => {
    const options = { ...defaults, ...opts };
    const toFetch = [];
    const isExpired = (item) => {
        if (!expiryDates[item]) return true;
        const currentTime = new Date().getTime();
        return currentTime > expiryDates[item];
    }
    const fetchAndCache = (toFetch) => {
        console.log('Successfully Fetched ...', toFetch);
        const currentTime = new Date().getTime();
        console.log('Current Time Is:', currentTime);
        toFetch.forEach((key) => {
            expiryDates[key] =  currentTime + options?.fetchData?.Names[key];
        });
        console.log('Updated Expiry Dates:', expiryDates);        
    }
    
    // Stage params to fetch
    Object.entries(options?.fetchData?.Names).forEach(key => {
        console.log(key[0], 'is expired:', isExpired(key[0]));
        if(isExpired(key[0])) toFetch.push(key[0]);
    });
    console.log('These will be fetched:', toFetch);   
    // Fetch and cache params 
    fetchAndCache(toFetch);
}

// Handler that is using the middy middleware
const handler = async () => {
    const ssmList = {
        fetchData: {
            Names: {
                a: 4000, 
                b: 0,
                c: 2000
            }
        }
    };
    middleware(ssmList);
}

////////// BELOW CODE IS ONLY TO MINIC THE CALL TO THE HANDLER ///////////
// Simulate 5 requests going to the lambda handler 1 sec apart
const invocations = async () => {
    const sleep = (ms) => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }
    for (i=1; i <= 5; i++) {
        console.log('\nCall ', i);
        await handler();
        await sleep(1000);
    }
}

invocations();