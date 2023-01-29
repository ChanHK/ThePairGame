"use client";
import styles from "./page.module.css";
import React, { Component } from "react";
import Image from "next/image";

class Images {
  constructor(pic, index) {
    this.pic = pic;
    this.isSelected = false;
    this.hide = true;
    this.index = index;
    this.correct = false;
  }
}

const pictures = [
  "/agent47.png",
  "/geralt.jpg",
  "/aloy.png",
  "/tracer.jpg",
  "/joel.jpg",
  "/kassandra.jpg",
  "/kratos.jpg",
];

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      pairs: this.GetPairs(),
      count: 0,
      latestSelectedIndex: null,
    };
  }

  GetPairs = () => {
    var array = [],
      index = 0;
    pictures.forEach((pic) => {
      array.push(new Images(pic, index));
      array.push(new Images(pic, index));
      index += 1;
    });
    return this.shuffle(this.shuffle(array));
  };

  shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  validation = () => {
    var { pairs, count } = this.state;
    var newPair = pairs;

    var newArray = pairs.filter((x) => x.isSelected && !x.correct);
    if (count > 1 && count % 2 !== 0) newPair = this.updateIncorrectPairsHide();

    if (newArray.length === 2 && newArray[0].index !== newArray[1].index) {
      var firstIndex = pairs.findIndex(
        (x) => x.isSelected && !x.correct && x.index === newArray[0].index
      );

      var secondIndex = pairs.findIndex(
        (x) => x.isSelected && !x.correct && x.index === newArray[1].index
      );
      newPair = this.updateIncorrectPairsSelected(firstIndex, secondIndex);
    }

    if (newArray.length >= 2 && newArray[0].index === newArray[1].index) {
      newPair = this.updateCorrectPairs(newArray[0].index, true);
    }

    if (JSON.stringify(newPair) !== JSON.stringify(pairs))
      this.setState({ pairs: newPair });
  };

  updateCorrectPairs = (index) => {
    let newPair = this.state.pairs;

    newPair.forEach((pair) => {
      if (pair.index === index) pair.correct = true;
    });
    return newPair;
  };

  updateIncorrectPairsSelected = (firstIndex, secondIndex) => {
    let newPair = this.state.pairs;
    newPair[firstIndex].isSelected = false;

    newPair[secondIndex].isSelected = false;

    return newPair;
  };

  updateIncorrectPairsHide = () => {
    let newPair = this.state.pairs;
    newPair.forEach((item, index) => {
      if (
        !item.isSelected &&
        !item.hide &&
        index !== this.state.latestSelectedIndex
      ) {
        newPair[index].hide = true;
      }
    });

    return newPair;
  };

  onChangeSelected = (index) => {
    this.setState({
      pairs: [
        ...this.state.pairs.slice(0, index),
        {
          ...this.state.pairs[index],
          isSelected: true,
          hide: false,
        },
        ...this.state.pairs.slice(index + 1),
      ],
      count: this.state.count + 1,
      latestSelectedIndex: index,
    });
  };

  restart = () => {
    this.setState({
      pairs: this.GetPairs(),
      count: 0,
      latestSelectedIndex: null,
    });
  };

  render() {
    var { pairs, count } = this.state;

    this.validation();
    return (
      <main className={styles.main}>
        <div className={styles.descriptionBox}>
          <div className={styles.description}>
            <p>The Pair Game</p>
          </div>
          <div className={styles.description}>
            {count > 0 ? <p>Steps : {count}</p> : <p>Select any to start</p>}
            {count > 0 && (
              <button className={styles.button} onClick={() => this.restart()}>
                Restart
              </button>
            )}
          </div>
        </div>

        <div className={styles.imagesContainer}>
          {pairs.map((item, index) => {
            return item.hide ? (
              <div
                className={styles.imageBox}
                onClick={() =>
                  item.correct ||
                  item.isSelected ||
                  this.onChangeSelected(index)
                }
              >
                <Image
                  id={index}
                  src="/card2.png"
                  alt="XP"
                  width="100"
                  height="150"
                />
              </div>
            ) : (
              <div
                className={styles.imageBox}
                onClick={() =>
                  item.correct ||
                  item.isSelected ||
                  this.onChangeSelected(index)
                }
              >
                <Image
                  id={index}
                  src={item.pic}
                  alt={index}
                  width="100"
                  height="150"
                />
              </div>
            );
          })}
        </div>
      </main>
    );
  }
}
