import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  async requestDataExport(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const orders = await this.prisma.order.findMany({ where: { userId } });

    const csvWriter = createObjectCsvWriter({
      path: `user-data-${userId}.csv`,
      header: [
        { id: 'email', title: 'Email' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
      ],
    });

    await csvWriter.writeRecords([user]);

    console.log(`Exported data for user ${userId}`);
    return { message: 'Data export generated successfully' };
  }

  async deleteUserData(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    console.log(`Deleted data for user ${userId}`);
    return { message: 'User data deleted successfully' };
  }

  async manageConsents(userId: string, consentData: any) {
    // In a real application, you would store consent data in the database.
    console.log(`Managing consents for user ${userId}:`, consentData);
    return { message: 'Consents managed successfully' };
  }

  async auditDataAccess(userId: string, accessDetails: any) {
    // In a real application, you would log all data access events.
    console.log(`Auditing data access for user ${userId}:`, accessDetails);
  }

  async generatePrivacyReport(userId: string) {
    // In a real application, you would generate a more detailed privacy report.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    console.log('Generating privacy report for user:', user);
    return { report: 'privacy-report-content' };
  }
}
