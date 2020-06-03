const width = (window.innerWidth > 500) ? 480 : 300;
const height = 500;
const margin = { left: 25, right: 25, top: 50, bottom: 10 };

const data = [100, -10, 100, -50, 200, -100, 80, -100, 150, -20, 70]
const snake_thickness = 10;
const snake_gap = 2;

const svg = d3.select('#chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
const t = svg.transition().duration(750);

let snake = (forward, w, h, r=h/2) =>
  forward ?
    `M0,${h} v${-(h-r)} a${r},${r} 0 0 1 ${r},${-r} h${w-r} v${h-r} a${r},${r} 0 0 1 ${-r},${r} z` :
    `M${w-r},0 a${r},${r} 0 0 1 ${r},${r} v${h-r} h${-(w-r)} a${r},${r} 0 0 1 ${-r},${-r} v${-(h-r)} z`

let draw = () => {
  svg.selectAll("*").remove();

  const duration_move_down = 100;

  let sum = 0;
  let sum_abs = 0;
  data.forEach((d, i) => {
    if (layouts.snake) {
      svg.append('path')
        .style('fill', (d > 0) ? "salmon" : "crimson")
        .attr('d', snake(d > 0, Math.abs(d), snake_thickness))
        .style('opacity', 0)
        .attr("transform", `translate(${sum + ((d > 0) ? 0 : d)},0)`)
        .transition()
          .delay(i*500)
          .style('opacity', 1)
          .attr("transform", `translate(${sum + ((d > 0) ? 0 : d)},${(data.length - i)*(snake_thickness + snake_gap)})`)
    } else if (layouts.fish) {
      let rect = svg.append('rect')
        .style('fill', (d > 0) ? "salmon" : "crimson")
        .attr('height', snake_thickness)
        .attr('width', 0)
        .attr('x', (d > 0) ? 0 : -d)
        .attr('y', 0)
        .attr('transform', `translate(${sum + ((d > 0) ? 0 : d)},0)`)
        // .attr("transform", `translate(${sum + ((d > 0) ? 0 : d)},${(data.length - i)*(snake_thickness + snake_gap)})`)
        .transition()
          .duration(Math.abs(d)*10)
          .delay(sum_abs*10 + duration_move_down)
          .attr('width', Math.abs(d))
          .attr('x', 0);

      for (let j = i+1; j < data.length; j++) {
        rect = rect.transition()
          .duration(Math.abs(data[j])*10)
          .attr('y', (j - i)*(snake_thickness + snake_gap));
      }
    }
    sum += d;
    sum_abs += Math.abs(d);
  })
}

const buttons = {
  snake: d3.select('#transform-button-snake'),
  fish: d3.select('#transform-button-fish'),
}
let layouts = { snake: false, fish: true };
let transform = shape => {
  if (!layouts[shape]) {
    for (let key in layouts) {
      layouts[key] = false;
      buttons[key].classed("highlighted", false);
    }
    layouts[shape] = true;
    buttons[shape].classed("highlighted", true);
    
    draw();
  }
}

const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.', 'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
let month_from_thai_text = (text) => {
  return months.indexOf(text);
}
let date_from_text = (text) => {
  if (text) {
    let ddmm = text.split(/-| /);
    return new Date(2020, month_from_thai_text(ddmm[1]), +ddmm[0]);
  } else {
    return Date.now();
  }
}
let text_from_date = date => `${date.getDate()} ${months[date.getMonth()]}`

draw();