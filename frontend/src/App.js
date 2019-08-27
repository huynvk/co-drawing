import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    paint: false,
    completePaths: [],
    onGoingPath: []
  };

  addClick = (x, y) => {
    this.setState(({ onGoingPath }) => {
      return { onGoingPath: [...onGoingPath, { x, y }] };
    });
  };

  convertX = (x, left) => x - left;
  convertY = (y, top) => y - top;

  drawPath = (canvas, path) => {
    const { left, top } = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (path.length === 0) {
      return;
    }
    for (var i = 1; i < path.length; i++) {
      const startPoint = path[i - 1];
      const endPoint = path[i];
      context.beginPath();
      context.moveTo(
        this.convertX(startPoint.x, left),
        this.convertX(startPoint.y, top)
      );
      context.lineTo(
        this.convertX(endPoint.x, left),
        this.convertX(endPoint.y, top)
      );
      context.closePath();
      context.stroke();
    }
  };

  componentWillUpdate() {
    const canvas = this.refs.canvas;
    if (!canvas) {
      return;
    }
    const { completePaths, onGoingPath } = this.state;
    completePaths.forEach(path => this.drawPath(canvas, path));
    this.drawPath(canvas, onGoingPath);
  }

  onMouseDown = e => {
    this.setState({ paint: true });
    this.addClick(e.pageX, e.pageY);
  };

  onMouseMove = e => {
    const { paint } = this.state;
    if (paint) {
      this.addClick(e.pageX, e.pageY);
    }
  };

  onMouseUp = e => {
    this.setState(({ completePaths, onGoingPath }) => {
      return {
        paint: false,
        completePaths: [...completePaths, onGoingPath],
        onGoingPath: []
      };
    });
  };

  render() {
    return (
      <div className="App">
        <canvas
          className="canvas"
          ref="canvas"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          width="800"
          height="800"
        />
      </div>
    );
  }
}

export default App;
