import { Campaign } from '../data/campaigns';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';

type CampaignTableProps = {
  campaigns: Campaign[];
};

export function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p>Campaigns</p>
          <h2>Performance by campaign</h2>
        </div>
        <button type="button">Export</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Channel</th>
              <th>Spend</th>
              <th>Revenue</th>
              <th>Conv.</th>
              <th>CTR</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const ctr = (campaign.clicks / campaign.impressions) * 100;

              return (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.channel}</td>
                  <td>{formatCurrency(campaign.spend)}</td>
                  <td>{formatCurrency(campaign.revenue)}</td>
                  <td>{formatNumber(campaign.conversions)}</td>
                  <td>{formatPercent(ctr)}</td>
                  <td>
                    <span className={`status ${campaign.status.toLowerCase()}`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
