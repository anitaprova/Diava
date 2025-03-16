import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

export default function Home() {
  const [toRead, setToRead] = useState(
    [{
      kind: "books#volume",
      id: "3vo0NQbIN2YC",
      etag: "fcmvY1ZtKzs",
      selfLink: "https://www.googleapis.com/books/v1/volumes/3vo0NQbIN2YC",
      volumeInfo: {
        title: "A Thousand Splendid Suns",
        authors: ["Khaled Hosseini"],
        publisher: "A&C Black",
        publishedDate: "2008-09-18",
        description:
          "'A Thousand Splendid Suns' is a chronicle of Afghan history, and a deeply moving story of family, friendship, and the salvation to be found in love.",
        industryIdentifiers: [
          {
            type: "ISBN_10",
            identifier: "074758589X",
          },
          {
            type: "ISBN_13",
            identifier: "9780747585893",
          },
        ],
        readingModes: {
          text: true,
          image: true,
        },
        pageCount: 419,
        printedPageCount: 380,
        dimensions: {
          height: "20.00 cm",
          width: "12.90 cm",
          thickness: "2.60 cm",
        },
        printType: "BOOK",
        categories: ["Fiction / General"],
        averageRating: 5,
        ratingsCount: 3,
        maturityRating: "NOT_MATURE",
        allowAnonLogging: false,
        contentVersion: "0.2.3.0.preview.3",
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE73ltHlgdBZnAr3uTrfjesX5Kda07IXsogqTTQDfLBdoixiNXmet01Gt4xYMVG69lw8r_2g-LYU4SejJncvDjg-Uls9B7RxovDBxuFGdG5IfiJ3bzhtSbUuNm2dpOzRcTwaiBs3i&source=gbs_api",
          thumbnail:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71jVhNuWmSXykiQxuqgjmnYXICqQKU_xGWgCb8bckuuq2JGVGBufunssx_MEON9cwxnZSVZ7X7gf9btSeZttBEqmw5ANGbrJDpjA_PALpf5beNOV5Gm7NKhu6Tr_cbaajc60bIG&source=gbs_api",
          small:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE72LY_kCdS-nwO89K5iY0Jvej2txHvf5qhf92aLr-kWcwMwgjge9Ku9tS4k0UnTNWgQOyvbz8aOvTeuXWMVJvyd4GBa02uP7guVqAHnYvju2cPI7zYq3y9ysPkLdJLAwK-vLsKJ9&source=gbs_api",
          medium:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE70sIz02FHKGWSFyuoSJRN3uJVZpauA5i_bhWBGJWZH7pSxtPu-V7hmDzk6bdhRrN76zHh4qFipIN5Et_vL_kNcg6Nk8bPqt6q0tuHZ39VktOFxZF3Y6jinf9K4JDrEz1UNZcwEj&source=gbs_api",
          large:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE73VUPIxnd-fRAMO5dl29RyPsNVdZlF3jJXeyB2pKMt8EEbaPYi3psCY0dHXh2RhT6vAb_RYVNNps-VPYQmFI80KrKLbsflkMVGUkdDnIOBI2nPf_UsOd2Qs12567X0zRNTe_BYy&source=gbs_api",
          extraLarge:
            "http://books.google.com/books/content?id=3vo0NQbIN2YC&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE72bPzBWhEcsbUR_jdx5G9xKv6mtuWoW7FeZGG1eCPBe_fHb03YNx2jR8BjaXOKByDSvDdKn4en9Hm2brKs-0jfc3Utn6kU2ck-K0AantFDjt2MZ6TXvTIwZ5bUboyUSLzo4OiF-&source=gbs_api",
        },
        language: "en",
        previewLink:
          "http://books.google.com/books?id=3vo0NQbIN2YC&hl=&source=gbs_api",
        infoLink:
          "https://play.google.com/store/books/details?id=3vo0NQbIN2YC&source=gbs_api",
        canonicalVolumeLink:
          "https://play.google.com/store/books/details?id=3vo0NQbIN2YC",
      },
      layerInfo: {
        layers: [
          {
            layerId: "geo",
            volumeAnnotationsVersion: "5",
          },
        ],
      },
      saleInfo: {
        country: "US",
        saleability: "NOT_FOR_SALE",
        isEbook: false,
      },
      accessInfo: {
        country: "US",
        viewability: "PARTIAL",
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: "ALLOWED",
        epub: {
          isAvailable: true,
          acsTokenLink:
            "http://books.google.com/books/download/A_Thousand_Splendid_Suns-sample-epub.acsm?id=3vo0NQbIN2YC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            "http://books.google.com/books/download/A_Thousand_Splendid_Suns-sample-pdf.acsm?id=3vo0NQbIN2YC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
        },
        webReaderLink:
          "http://play.google.com/books/reader?id=3vo0NQbIN2YC&hl=&source=gbs_api",
        accessViewStatus: "SAMPLE",
        quoteSharingAllowed: false,
      },
    },]
  );
  const [currentlyReading, setCurrentlyReading] = useState([""]);
  const [recommendation, setRecommendation] = useState([""]);
  console.log(toRead);
  return (
    <div className="ml-50 mr-50 mt-10 mt-10 font-merriweather space-y-10">
      <div className="grid grid-cols-5 gap-x-10">
        <div className="col-span-3">
          <Typography variant="h4">To Read Pile</Typography>
          <Box className="bg-grey flex gap-x-2 rounded-lg">
            {toRead.length > 0 ? (
              toRead.map((book) => (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  className="p-4"
                />
              ))
            ) : (
              <p>Nothing added yet</p>
            )}
          </Box>
        </div>

        <div className="col-span-2">
          <Typography variant="h4" className="w-full">
            Currently Reading
          </Typography>
          <Box className="bg-grey flex rounded-lg">
            {currentlyReading.length > 0 ? (
              toRead.map((book) => (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  className="p-4"
                />
              ))
            ) : (
              <p>Nothing added yet</p>
            )}
          </Box>
        </div>
      </div>

      <div className="w-full">
        <Typography variant="h4">Recommendation</Typography>
        <Box className="bg-grey flex rounded-lg">
          {recommendation.length > 0 ? (
            toRead.map((book) => (
              <img src={book.volumeInfo.imageLinks.thumbnail} className="p-4" />
            ))
          ) : (
            <p>Nothing added yet</p>
          )}
        </Box>
      </div>
    </div>
  );
}
