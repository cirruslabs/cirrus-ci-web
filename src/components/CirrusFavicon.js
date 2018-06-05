import React from 'react';
import {cirrusColors} from "../cirrusTheme";
import {Base64} from 'js-base64';

function updateIcon(color) {
  let linkEl = document.getElementById('favicon');
  if (linkEl) {
    linkEl.type = 'image/x-icon';
    linkEl.rel = 'icon';
    drawIcon(color, function (url) {
      console.log(url);
      linkEl.href = url;
    });
  }
  return <div/>;
}

function drawIcon(color, cb) {
  let img = document.createElement('img');
  img.onload = function () {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');
    context.clearRect(0, 0, img.width, img.height);
    context.drawImage(img, 0, 0);

    cb(context.canvas.toDataURL());
  };
  img.src = "data:image/svg+xml;base64," + Base64.encode(iconSVG(color));
}

function iconSVG(color) {
  color = color || cirrusColors.cirrusDark;
  return `
<svg width="38px" height="37px" viewBox="0 0 38 37" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g id="cirrus-logo" transform="translate(3.000000, 3.000000)" stroke="${color}" stroke-width="4">
            <path d="M0,30.6352941 L26.9090909,30.6352941" id="Shape" fill="#000000" fill-rule="nonzero"></path>
            <path d="M26.9090909,30.6352941 C29.7207224,30.6352941 32,28.3493127 32,25.5294118 C32,22.7095108 29.7207224,20.4235294 26.9090909,20.4235294" id="Shape"></path>
            <path d="M0,20.4235294 L26.9090909,20.4235294" id="Shape" fill="#000000" fill-rule="nonzero"></path>
            <path d="M26.9090909,20.4235294 C29.7207224,20.4235294 32,18.137548 32,15.3176471 C32,12.4977461 29.7207224,10.2117647 26.9090909,10.2117647" id="Shape"></path>
            <path d="M0,10.2117647 L26.9090909,10.2117647" id="Shape" fill="#000000" fill-rule="nonzero"></path>
            <path d="M26.9090909,10.2117647 C29.7207223,10.2117647 31.9999999,7.92578328 31.9999999,5.10588235 C31.9999999,2.28598142 29.7207223,4.20197953e-08 26.9090909,-3.55271368e-15" id="Shape"></path>
        </g>
    </g>
</svg>
`
}

class CirrusFavicon extends React.Component {
  componentWillUnmount() {
    updateIcon(null);
  }

  render() {
    updateIcon(this.props.color);
    return null;
  }
}

export default CirrusFavicon;
