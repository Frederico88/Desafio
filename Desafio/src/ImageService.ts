interface PixelData {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  positionX: number;
  positionY: number;
  color: string;
} //interface para tipagem do objeto

var PixelsRepresentation: PixelData[] = [];

function getPixels(imgData: ImageData, weight: number, height: number) {
  for (let i = 0; i < imgData.data.length; i += 4) {
    let positionX = Math.floor(i / 4) % 704; //4 opções de cores (rgba) e a posição é sempre o resto da divisão do tamanho total do eixo x.  
    let positionY = Math.floor(i / 4 / 704); //4 opções de cores (rgba) e a posição é encontrada com o y sendo percorrido 704 vezes durante a largura(x) para depois ser incrementado

    let setColor: string = 'other'; 
    let r = imgData.data[i];   // primeira posicão r
    let g = imgData.data[i + 1]; //segunda posição g
    let b = imgData.data[i + 2]; //terceira posição b

    if (r == 255 && g == 0 && b == 0) {
      setColor = 'red'; //se o rgb for (255,0,0) é um meteoro
    } else if (r == 255 && g == 255 && b == 255) {
      setColor = 'white';  //se o rgb for (255,255,255) é uma estrela
    } else if (r == 0 && g == 0 && b == 255) {
      setColor = 'blue';  //se o rgb for (0,0,255) é água
    }

    let data = {
      red: r,
      green: g,
      blue: b,
      alpha: imgData.data[i + 3],
      color: setColor,
      positionX,
      positionY,
    }; //alocando todos os valores encontrados a partir do push abaixo

    PixelsRepresentation.push(data);
  }

  //comparação entre todos os valores que foram encontrados no data com a quantidade total de pixels
  if (PixelsRepresentation.length === height * weight) {
    let redPixels = PixelsRepresentation.filter(
      (pixel) => pixel.color === 'red'  //filtra o array e retorna todos os pixels vermelhos e a coordenada de cada uma
    );
    let bluePixels = PixelsRepresentation.filter(
      (pixel) => pixel.color === 'blue' //filtra o array e retorna todos os pixels azuis e a coordenada de cada um
    );
    let bluePixelsPositionY = bluePixels.map((pixel) => {
      return pixel.positionY; //mapeamento de todos os pixeis azuis como em cima, porém deixando apenas a posição y de cada que é o que será util para nós
    });
    let whitePixels = PixelsRepresentation.filter(
      (pixel) => pixel.color === 'white' //filtra o array e retorna todos os pixels brancos e a coordenada de cada um
    );

    let countWillFallOnTheWater = 0; //variavel que irá alocar quantos meteoros cairam na agua

    let levelWater = Math.min(...bluePixelsPositionY); //como o mapeamento foi feito de cima pra baixo e da direita para a esquerda, usou-se o pixel mínimo para alocar ao eixo x da água

    for (let j = 0; j < bluePixels.length; j++) {
      for (let k = 0; k < redPixels.length; k++) {
        if (bluePixels[j].positionY === levelWater) //o pixel azul está no nível minimo?
          if (bluePixels[j].positionX === redPixels[k].positionX) {
            countWillFallOnTheWater++; //se o pixel azul estiver no nivel minimo e a posição x do pixel azul for a mesma do pixel do meteoro, teremos colisão.
          }
      }
    }

    console.log(`Count the number of Meteors: ${redPixels.length}`);
    console.log(`Count the number of Stars: ${whitePixels.length}`);
    console.log(`Count the number of water pixels: ${bluePixels.length}`)
    console.log(
      `If the Meteors are falling perpendicularly to the Ground (Water level), count how many will fall on the Water: ${countWillFallOnTheWater}`
    );
  }
}

function init() {
  var canvas = document.querySelector('canvas');
  var Rep2D = canvas?.getContext('2d'); //passando para 2d

  const img1 = new Image(); //objeto imagem
  img1.src = 'assets/meteor.png'; 
  img1.crossOrigin = 'Anonymous';

  const height = 704;
  const weight = 704;

  img1.onload = function () {
    if (Rep2D) {
      Rep2D.drawImage(img1, 0, 0, weight, height);
      var idata = Rep2D.getImageData(0, 0, weight, height);
      getPixels(idata, weight, height);
    }
  };
}

init();
