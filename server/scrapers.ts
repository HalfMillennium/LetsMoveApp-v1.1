export async function fetchListings(
    baseUrl: string,
    page: number,
    endpoint: string,
    token: string,
  ) {
    const url = `${baseUrl}/search/ny/rentals?page=${page}`;
    const response = await fetch(`${endpoint}?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation ExtractListings($url: String!) {
          goto(
            url: $url,
            waitUntil: networkIdle
          ) {
            status
          }
          listings: mapSelector(selector: "[data-testid='listing-card']") {
            boro: mapSelector(selector: "[class*='ListingDescription-module__title___']") {
              innerText
            }
            general: mapSelector(
              selector: "[class*='ListingDescription-module__addressTextAction___']"
            ) {
              address: innerText
              listingUrl: attribute(name: "href") {
                name
                value
              }
            }
            price: mapSelector(selector: "[class*='PriceInfo-module__price___']") {
              innerText
            }
            netEffective: mapSelector(
              selector: "[class*='PriceInfo-module__priceDetailsContainer___'] > p"
            ) {
              innerText
            }
            leaseTerm: mapSelector(
              selector: "[class*='PriceInfo-module__priceDetails___']:not([class*='priceConcession'])"
            ) {
              innerText
            }
            beds: mapSelector(
              selector: "[class*='BedsBathsSqft-module__item___']:nth-child(1) [class*='BedsBathsSqft-module__text___']"
            ) {
              innerText
            }
            baths: mapSelector(
              selector: "[class*='BedsBathsSqft-module__item___']:nth-child(2) [class*='BedsBathsSqft-module__text___']"
            ) {
              innerText
            }
            sqft: mapSelector(
              selector: "[class*='BedsBathsSqft-module__item___']:nth-child(3) [class*='BedsBathsSqft-module__text___']"
            ) {
              innerText
            }
            listedBy: mapSelector(selector: "[class*='ListingBy-module__ListingBy___']") {
              innerText
            }
            imageUrls: mapSelector(
              selector: "[class*='CardImage-module__cardImage___']"
            ) {
              src: attribute(name: "src") {
                name
                value
              }
            }
          }
          maxPageCount: mapSelector(
            selector: "nav[aria-label='Pagination'] ul li:nth-last-child(2) a"
          ) {
            innerText
          }
        }
        `,
        variables: {
          url,
        },
      }),
    });
  
    const data = await response.json();
    return data;
  }
  
  export async function fetchListingDetails(
    url: string,
    endpoint: string,
    token: string,
  ) {
    const response = await fetch(`${endpoint}?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation ExtractHtml($url: String!) {
          goto(url: $url, waitUntil: networkIdle) {
            status
          }
          images: mapSelector(selector: "[class^='MediaCarousel_mediaCarouselImageWrapper_']") {
            imageContainer: innerHTML
          }
          price: querySelector(selector: "[class*='PriceInfo_price__']") {
            text: innerText
          }
          specs: mapSelector(selector: "[class^='PropertyDetails_item__']") {
            item: innerText
          }
          about: querySelector(selector: "[class^='ListingDescription_shortDescription__']") {
            descriptionHtml: innerHTML
          }
          featuresEmbed: querySelector(selector: "[class^='Lists_listsWrapper__']") {
            featuresHtml: innerHTML
          }
          listedBy: querySelector(selector: "[class*='styled__AgentText']") {
            agentInfo: innerText
          }
        }
        `,
        variables: {
          url,
        },
      }),
    });
  
    const data = await response.json();
    console.log(data);
    return data;
  }