import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from './entities/user.entity';
import { Negotiation } from './entities/negotiation.entity';
import { Party } from './entities/party.entity';
import { Issue } from './entities/issue.entity';
import { PartyIssuePreference } from './entities/party-issue-preference.entity';
import { Position } from './entities/position.entity';
import { Offer } from './entities/offer.entity';
import { OfferEvaluation } from './entities/offer-evaluation.entity';
import { Round } from './entities/round.entity';
import { TranscriptEntry } from './entities/transcript-entry.entity';
import { Optimization } from './entities/optimization.entity';
import { ParetoPoint } from './entities/pareto-point.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { RiskOutcome } from './entities/risk-outcome.entity';
import { Precedent } from './entities/precedent.entity';
import { Approval } from './entities/approval.entity';
import { Export } from './entities/export.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Negotiation,
          Party,
          Issue,
          PartyIssuePreference,
          Position,
          Offer,
          OfferEvaluation,
          Round,
          TranscriptEntry,
          Optimization,
          ParetoPoint,
          RiskAssessment,
          RiskOutcome,
          Precedent,
          Approval,
          Export,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Negotiation,
      Party,
      Issue,
      PartyIssuePreference,
      Position,
      Offer,
      OfferEvaluation,
      Round,
      TranscriptEntry,
      Optimization,
      ParetoPoint,
      RiskAssessment,
      RiskOutcome,
      Precedent,
      Approval,
      Export,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
