import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=650");
      const data: PokeResponse = await response.json();
      const insertPromisesArray = [];
      const pokemonToInsert: {name: string, no: number}[] = [];

      data.results.forEach(async({name, url}) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        // const pokemon = await this.pokemonModel.create({name, no});
        // insertPromisesArray.push(
        //   this.pokemonModel.create({name, no})
        // );
        pokemonToInsert.push(
          {name, no}
        );
      })
      await this.pokemonModel.insertMany(pokemonToInsert);
      // await Promise.all(insertPromisesArray);

      return "Seed executed.";

    } catch (error) {
      console.log(error);
    }
  }
}
