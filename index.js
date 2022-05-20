let imagesData = [];
let imageUrlPointer = 0;

const highlightedUrlProp = {
  backgroundColor: "#2459c9",
  color: "white",
};

const normalUrlProp = {
  backgroundColor: "white",
  color: "black",
};

const maxCharacters = 40;

const getData = async () => {
  await fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      imagesData = data;
    })
    .catch((err) => console.log(err));
};
await getData();

const PreviewSelectedImage = () => {
  const image = imagesData[imageUrlPointer];
  const imageContainer = document.querySelector(".image_container");
  imageContainer.innerHTML = `
            <img src="${image.previewImage}"/>
            <input type="text" value="${image.title}"/>
        `;
  imageContainer.querySelector("input").addEventListener("change", (event) => {
    imagesData[imageUrlPointer].title = event.target.value;
    document.querySelector(`#image-${imageUrlPointer} p`).innerHTML =
      event.target.value;
  });
};

const updateCompsWithPointerChange = (newUrlPointer) => {
  if (newUrlPointer === imageUrlPointer) return;
  Object.assign(
    document.querySelector(`#image-${newUrlPointer}`).style,
    highlightedUrlProp
  );
  Object.assign(
    document.querySelector(`#image-${imageUrlPointer}`).style,
    normalUrlProp
  );
  imageUrlPointer = newUrlPointer;
  PreviewSelectedImage();
};

const initializeApp = () => {
  const imageFolder = document.querySelector(".image_folder");
  imagesData.forEach((image, index) => {
    const imageUrl = document.createElement("li");
    imageUrl.className = "image_url";
    imageUrl.id = `image-${index}`;
    imageUrl.addEventListener("click", (event) => {
      let element = event.target;
      while (element.className !== "image_url") element = element.parentNode;
      const newUrlPointer = element.id.split("-")[1];
      updateCompsWithPointerChange(newUrlPointer);
    });
    imageUrl.innerHTML = `
            <img src="${image.previewImage}" class="image_url_preview"/>
            <p class="image_url_title">${image.title}</p>
        `;
    if (index === imageUrlPointer) {
      Object.assign(imageUrl.style, highlightedUrlProp);
    }
    imageFolder.append(imageUrl);
  });

  PreviewSelectedImage();

  document.body.addEventListener("keydown", (event) => {
    const pressedKey = event.key;
    if (pressedKey === "ArrowDown") {
      updateCompsWithPointerChange((imageUrlPointer + 1) % imagesData.length);
    }
    if (pressedKey === "ArrowUp") {
      updateCompsWithPointerChange(
        (imageUrlPointer - 1 + imagesData.length) % imagesData.length
      );
    }
  });
};

initializeApp();
