import React, { Component } from "react";

import "fetch";

import CapturePicture from "../../components/CapturePicture/CapturePicture";

class CaptureContainer extends Component {
  constructor() {
    super();
    this.state = {
      image: "",
      imageUrl: "",
      latitude: "",
      longitude: "",
      response: { received: false }
    };

    this.getCoordinates();
  }

  createImageUrl = async base64Image => {
    const uri = `${process.env.REACT_APP_BACKEND_ENDPOINT}/services/create-image-url`;
    const data = {
      file: base64Image
    };

    return fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ imageUrl: res.url, image: base64Image });
      })
      .catch(err => {
        console.error(err.message);
      });
  };

  getCoordinates = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  };

  getRecyclingInfo = async base64Image => {
    await this.createImageUrl(base64Image);

    const uri = `${process.env.REACT_APP_BACKEND_ENDPOINT}/recycle-requests`;
    const body = {
      user_id: 0,
      image_url: this.state.imageUrl,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };

    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          response: {
            ...res.response,
            received: true
          }
        });
      })
      .catch(err => console.error(err));
  };

  render() {
    let recyclingInfo = <div></div>;

    if (this.state.response.received) {
      const {
        container_material,
        container_type,
        is_recyclable,
        fact,
        council
      } = this.state.response;
      recyclingInfo = (
        <div>
          <div>The Material of your Container is: {container_material}</div>
          <div>It is a: {container_type}</div>
          <div>
            And it {is_recyclable ? "can be" : "cannot be"} recycled in{" "}
            {council}
          </div>
          <div>
            Did you know that {container_material} can be used for {fact}
          </div>
        </div>
      );
    }

    return (
      <>
        <CapturePicture onCapture={this.getRecyclingInfo} />
        {recyclingInfo}
      </>
    );
  }
}

export default CaptureContainer;
