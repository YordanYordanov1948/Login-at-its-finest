import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    // const box = document.createElement("div");
    // box.classList.add("box");
    // box.innerHTML = this._render({
    //   name: "Placeholder",
    //   terrain: "placeholder",
    //   population: 0,
    // });
    // document.body.querySelector(".main").appendChild(box);
    this._loading();
    this._startLoading();

    this.emit(Application.events.READY);
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  _loading() {
    const loadingBar = document.body.querySelector("progress");
  }

  async _load() {
    function _create({ name, terrain, population }) {
      return `
    <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img src="${image}" alt="planet">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
        <h4>${name}</h4>
          <p>
            <span class="tag">${terrain}</span> <span class="tag">${population}</span>
            <br>
          </p>
        </div>
      </div>
    </article>
    </div>
        `;
    }

    const getPlanetsData = async () => {
      const request = await fetch("https://swapi.boom.dev/api/planets");
      const data = await request.json();
      displayPlanets(data);
      return data;
    };

    function displayPlanets(data) {
      const boxesDiv = document.createElement("div");
      boxesDiv.setAttribute("id", "boxes");
      let boxes = "";
      // Loop to access all rows
      for (let planet of data.results) {
        boxes += _create({
          name: planet.name,
          terrain: planet.terrain,
          population: planet.population,
        });
      }
      document.body.querySelector(".main").appendChild(boxesDiv);
      document.getElementById("boxes").innerHTML += boxes;
    }

    const getMoreAPIDataWithUrl = async (newUrl) => {
      if (newUrl != null) {
        const request = await fetch(newUrl);
        const data = await request.json();
        getMoreAPIDataWithUrl(data.next);
        displayPlanets(data);
        return data;
      } else {
        this._stopLoading();
      }
    };

    const callDataInOrder = async () => {
      const planetsData = await getPlanetsData();

      const detailData = getMoreAPIDataWithUrl(planetsData.next);
    };

    callDataInOrder();
  }

  _startLoading() {
    this._load();
  }

  _create({ name, terrain, population }) {
    return `
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="${image}" alt="planet">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
      <h4>${name}</h4>
        <p>
          <span class="tag">${terrain}</span> <span class="tag">${population}</span>
          <br>
        </p>
      </div>
    </div>
  </article>
      `;
  }

  _stopLoading() {
    const loadingBar = document.body.getElementsByClassName("progress")[0];
    loadingBar.style.display = "none";
  }
}
