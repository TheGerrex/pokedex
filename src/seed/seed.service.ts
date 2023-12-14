import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  async executeSeed() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
      const data: PokeResponse = await response.json();

      data.results.forEach(({name, url}) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        console.log({name, no});
      })

      return data.results;
    } catch (error) {
      console.log(error);
    }
  }
}
