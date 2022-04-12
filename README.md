# CPU Monitor
### Demo: https://cpu-monitorcb.herokuapp.com/
* Displays average CPU usage in 10 second intervals
* Shows warning alert if usage over 100
* Shows data in a table for around 10 minutes 
* Plots data points in a line graph

## If I were to extend this for production I would:
* Use reducers instead of long list of useState hooks
* Implement more test coverage
* Add clearer labels - ie 50% instead of 50 - to graph & graph tooltip
* Clean up the graph's Y-axis, at first it should only show up to 100% then grow when CPU exceeds 100%
* Display loading text over full-height graph section before it's populated instead of having the element get taller when populated
