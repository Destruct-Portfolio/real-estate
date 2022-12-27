1.[DONE] The only issue I've noticed on 4zida is that the phone numbers are not getting scraped,

2.[TESTING]\_[Re_DO]Nekretnine has a more serious problem.
Many ads are not getting scraped properly. Null data type is present too many times in scraped data

3. [TWO-PARTS]
   [NOT_YET] There are duplicates in Halo
   , and I think I've found out why. For some reason this website sometimes generates
   different URL's for the same ad, so we need to find a better way to check for duplicates.

   [DONE] Halo also also has a location problem,

4. The script doesn't start again when it finishes with everything.[CRON_Issue]

5.[NEED_SOME_Research] The script consumes too many CPU and RAM resources when it gets started. The good thing is that as the script continues, the usage gets more normal.
