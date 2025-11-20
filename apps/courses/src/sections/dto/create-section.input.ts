import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSectionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
