1. The only issue I've noticed on 4zida is that the phone numbers are not getting scraped,

2. Nekretnine has a more serious problem. Many ads are not getting scraped properly. Null data type is present too many times in scraped data (I will attach a screenshot so you can get a better idea)

3. There are duplicates in Halo, and I think I've found out why. For some reason this website sometimes generates different URL's for the same ad, so we need to find a better way to check for duplicates.
   Halo also also has a location problem, as I mentioned in my previous revision.

4. The script doesn't start again when it finishes with everything.

I think all of the above is easily fixable. As for the the main problem...

5. The script consumes too many CPU and RAM resources when it gets started. The good thing is that as the script continues, the usage gets more normal.
