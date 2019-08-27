import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    clickX: [],
    clickY: [],
    clickDrag: [],
    paint: false
  };

  componentDidMount() {
    const text = this.props.text || "Sample Text";
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const img = this.refs.image;
    console.log(
      "canvas.getBoundingClientRect() :",
      canvas.getBoundingClientRect()
    );

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.font = "40px Courier";
      ctx.fillText(text, 210, 75);
    };
  }

  addClick = (x, y, dragging) => {
    this.setState(state => {
      const { clickX, clickY, clickDrag } = state;
      return {
        clickX: [...clickX, x],
        clickY: [...clickY, y],
        clickDrag: [...clickDrag, dragging]
      };
    });
  };

  convertX = (x, left) => x - left;
  convertY = (y, top) => y - top;

  componentWillUpdate() {
    const { clickX, clickY, clickDrag } = this.state;
    const canvas = this.refs.canvas;
    if (!canvas) {
      return;
    }
    const { left, top } = canvas.getBoundingClientRect();

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "red";
    context.lineJoin = "round";
    context.lineWidth = 5;
    for (var i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(
          this.convertX(clickX[i - 1], left),
          this.convertX(clickY[i - 1], top)
        );
      } else {
        context.moveTo(
          this.convertX(clickX[i] - 1, left),
          this.convertX(clickY[i], top)
        );
      }
      context.lineTo(
        this.convertX(clickX[i], left),
        this.convertX(clickY[i], top)
      );
      context.closePath();
      context.stroke();
    }
  }

  onMouseDown = e => {
    console.log("e :", e);
    const { clientX, clientY, pageX, pageY, screenX, screenY } = e;
    console.log({ clientX, clientY, pageX, pageY, screenX, screenY });
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    this.setState({ paint: true });
    this.addClick(mouseX, mouseY);
  };

  onMouseMove = e => {
    const { paint } = this.state;
    if (paint) {
      this.addClick(e.pageX, e.pageY, true);
    }
  };

  onMouseUp = e => {
    this.setState({ paint: false });
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
        <img
          ref="image"
          src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
          className="hidden"
          alt="img"
        />
      </div>
    );
  }
}

export default App;
