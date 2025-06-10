//Instalamos: npm install commander

import { Command } from "commander";
const program = new Command(); 

//1 - Command // 2- description // 3- default value
program
    .option("-p <port>", "port where server is running", 8080)
    .option("--mode <mode>", "mode of server", "production")
program.parse(); 

//to verify previus configured options
//console.log("Opciones : ", program.opts()); 

export default program; 