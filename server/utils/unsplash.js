const searchImage = async()=>{
    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent("car")}&per_page=1&orientation=landscape`,{
            headers:{
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        })

        const data = await res.json()
        console.log(data);
        
    } catch (error) {
        
    }
}
searchImage()
export {searchImage}