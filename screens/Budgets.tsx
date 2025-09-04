import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Layout } from "components/Layout";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { mockData } from "../server/mockData";

const Budgets = () => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 48; // More padding for cleaner look

  // Calculate spending data from bucket items
  const bucketItems = mockData.bucketItems;
  const totalBudget = bucketItems.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const completedItems = bucketItems.filter((item) => item.completed);
  const totalSpent = completedItems.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const remaining = totalBudget - totalSpent;
  const savings = remaining * 0.15; // Assume 15% savings rate

  // Clean monthly spending trend data
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [450, 680, 320, 890, 650, 420],
        color: (opacity = 1) => colors.deluge,
        strokeWidth: 3,
      },
    ],
  };

  // Simplified category data for cleaner pie chart
  const categoryData = [
    {
      name: "Travel",
      population: 1200,
      color: colors.careysPink,
      legendFontColor: theme.text.primary,
      legendFontSize: 14,
    },
    {
      name: "Food",
      population: 680,
      color: colors.deluge,
      legendFontColor: theme.text.primary,
      legendFontSize: 14,
    },
    {
      name: "Learning",
      population: 350,
      color: colors.leather,
      legendFontColor: theme.text.primary,
      legendFontSize: 14,
    },
    {
      name: "Activities",
      population: 280,
      color: colors.aluminium,
      legendFontColor: theme.text.primary,
      legendFontSize: 14,
    },
  ];

  // Clean chart configuration
  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 0,
    color: (opacity = 1) => colors.deluge,
    labelColor: (opacity = 1) => theme.text.secondary,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.deluge,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#E5E5E5",
      strokeDasharray: "0",
    },
  };

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Clean Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Budget</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Account Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Account Balance</Text>
          <Text style={styles.balanceAmount}>
            ${totalBudget.toLocaleString()}
          </Text>
          <Text style={styles.balanceChange}>Last 30 Days +12%</Text>

          {/* Clean Line Chart */}
          <View style={styles.chartContainer}>
            <LineChart
              data={monthlyData}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              bezier
              withHorizontalLines={true}
              withVerticalLines={false}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={false}
              style={styles.lineChart}
            />

            {/* Time period labels */}
            <View style={styles.timePeriods}>
              <Text style={[styles.timePeriod, styles.activePeriod]}>1D</Text>
              <Text style={styles.timePeriod}>1W</Text>
              <Text style={styles.timePeriod}>1M</Text>
              <Text style={styles.timePeriod}>3M</Text>
              <Text style={styles.timePeriod}>1Y</Text>
            </View>
          </View>
        </View>

        {/* Financial Metrics */}
        <View style={styles.metricsSection}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Buying Power</Text>
            <Text style={styles.metricValue}>$580.00</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Interest accrued this month</Text>
            <Text style={styles.metricValue}>$23.20</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Lifetime interest paid</Text>
            <Text style={styles.metricValue}>$86.52</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Cash Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spending by Category - Cleaner Version */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.categoryChart}>
            <PieChart
              data={categoryData}
              width={chartWidth}
              height={200}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => colors.deluge,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute={false}
              hasLegend={true}
              style={styles.pieChart}
            />
          </View>
        </View>

        {/* Financial Insights - Cleaner Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Insights</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>📈</Text>
            <Text style={styles.insightText}>
              You're on track to save ${(savings * 12).toFixed(0)} this year
            </Text>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>🎯</Text>
            <Text style={styles.insightText}>
              {completedItems.length} of {bucketItems.length} bucket items
              completed
            </Text>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>
              Consider setting aside 20% of your budget for spontaneous
              adventures
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F8F9FA",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 18,
    color: theme.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  balanceSection: {
    backgroundColor: "#FFFFFF",
    margin: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 4,
  },
  balanceChange: {
    fontSize: 14,
    color: "#10B981",
    fontFamily: "Work Sans",
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: "transparent",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  lineChart: {
    borderRadius: 0,
  },
  timePeriods: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  timePeriod: {
    fontSize: 14,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activePeriod: {
    color: colors.deluge,
    fontWeight: "600",
  },
  metricsSection: {
    backgroundColor: "#FFFFFF",
    margin: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  metricItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  metricLabel: {
    fontSize: 16,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#6246EA",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Work Sans",
  },
  secondaryButtonText: {
    color: theme.text.primary,
  },
  section: {
    backgroundColor: "#FFFFFF",
    margin: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 16,
  },
  categoryChart: {
    alignItems: "center",
  },
  pieChart: {
    borderRadius: 0,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    lineHeight: 22,
  },
});

export default Budgets;
