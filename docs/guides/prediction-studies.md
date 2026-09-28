<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Frozen training and validation studies

Use an explicit prediction-study contract when you already have liquid-biopsy
feature tables and a reviewed training/validation split. This complements the
[assay-table workflows](assay-tables.md); it does not infer clinical labels,
automatically design a valid clinical cohort, or turn exploratory classification
into external validation.

## Prepare the source

Keep a JSON contract and its four input tables in the source folder. Tables may
be CSV, TSV or Parquet, with one row per sample and a shared `sample_id` column.
Feature tables contain numeric columns with matching definitions. Metadata needs
binary `label` values (0 and 1) and `patient_id`. Each partition must contain both
classes, with at least five training observations per class. Samples and patients
must not overlap between partitions. Repeated patient measurements require a
separate reviewed longitudinal design and are rejected by this workflow.

For example, `study.prediction.json`:

```json
{
  "version": 1,
  "assay": "small-rna",
  "value_kind": "processed_features",
  "train_features": "train.csv",
  "validation_features": "validation.csv",
  "train_metadata": "train_metadata.csv",
  "validation_metadata": "validation_metadata.csv",
  "independent_patients_confirmed": false,
  "split_description": "A fixed internal holdout; patient identity requires source review.",
  "preprocessing_provenance": "Published processed array intensities; upstream normalization was not reproduced.",
  "limitations": ["Internal holdout only; batch balance and patient independence require review."],
  "models": ["logistic", "rbf_svm", "random_forest"],
  "max_features": 200,
  "specificity_target": 0.95,
  "seed": 42
}
```

Do not replace unknown patient identities with invented identities and claim
independence. `independent_patients_confirmed: false` preserves this limitation;
it does not bypass detected overlaps. All paths must stay within the source.
Raw counts must be complete nonnegative integers; beta values must be within
0–1. Other declared numeric inputs can contain missing values, handled inside
training pipelines. Published upstream processing remains a separate limitation.

## Use it in Web or CLI

1. Attach the folder and ask: “Inspect the prediction contract and explain the
   split, measurement type and prerequisites. Do not fit yet.”
2. After review, ask: “Run the declared study, retain training-only model and
   threshold selection, and publish ROC, PR, calibration and performance results.”
3. Ask: “Reopen the saved summary. Which model was selected on training, and what
   specificity did it actually achieve on the holdout?”
4. For different feature sets with the same cohort, ask to compare their completed
   studies using each contract and its registered summary. The comparison checks
   frozen predictions and inputs, then produces paired AUROC differences and
   confidence intervals without refitting the parent models.

Both interfaces use the same scientific tools. Prediction studies currently run
through conversational tools (`inspect_prediction_study`, `run_prediction_study`,
`compare_prediction_studies`); they do not create standalone prediction entries
for the Plan panel's **Run next step** button. Existing explicit assay entries
remain discoverable and runnable when their contracts share the folder.

Model choice uses training CV. Preprocessing and feature selection are fitted
within training folds. The selected pipeline's OOF predictions determine a
training specificity target; this target is **not guaranteed on validation**.
The stored choice and validation probabilities are frozen before scoring.
OOF threshold estimates reuse the training-selected hyperparameters and are not
an independent, fully nested estimate of model-selection performance.

Prediction fitting and comparison share the existing six-scientific-jobs-per-turn
limit. They run locally and check cancellation between phases; Stop may wait for
an in-progress scikit-learn fit to return. This differs from the isolated worker
used by `run_analysis`.

## Results and boundaries

Outputs include the input fingerprints, frozen training choice, model files,
validation probabilities, per-model metrics, bootstrap AUROC intervals, ROC/PR/
calibration figures and a local report. They follow normal task ownership and
trash/restore/purge rules. Large reports can appear in Results; brief discussion
can stay in the conversation. Saved summary reads verify the probability-file
hash and identify the selected model rather than average scores across models.
ROC, precision–recall and calibration figures expose their types with their
registered handles. Reports use locally bound captions for these figures so a
model-supplied caption cannot swap their meanings.

Comparisons require identical training metadata and matching validation samples,
labels and patient groups; current training-metadata comparison is byte-for-byte,
so even reordered equivalent metadata may need reconciliation before fitting.
Intervals are exploratory and not multiplicity adjusted. A confidence interval
crossing zero does not establish superiority or equivalence. Paired differences
explicitly mean **study A minus study B**.

Existing source data, frozen parent results and accepted personal skills are not
changed by inspection or comparison. Starting a study is a new computation.
Training-only processing cannot remove leakage already introduced in published
inputs. High internal AUROC, including 1.0, is not clinical screening validation.

<!-- BEGIN CHINESE TRANSLATION -->
---
<a id="chinese"></a>

# 固定训练与验证的预测研究

这项功能适用于已有液体活检特征表、明确标签和经过审查的固定训练/验证划分。
它补充既有 [assay 表格流程](assay-tables.md)，不会自动推断临床标签或替用户建立
有效的临床验证设计。

## 输入与操作

将 JSON 配置及四份表格放在同一来源目录。配置示例：

```json
{
  "version": 1,
  "assay": "small-rna",
  "value_kind": "processed_features",
  "train_features": "train.csv",
  "validation_features": "validation.csv",
  "train_metadata": "train_metadata.csv",
  "validation_metadata": "validation_metadata.csv",
  "independent_patients_confirmed": false,
  "split_description": "A fixed internal holdout; patient identity requires source review.",
  "preprocessing_provenance": "Published processed array intensities; upstream normalization was not reproduced.",
  "limitations": ["Internal holdout only; batch balance and patient independence require review."],
  "models": ["logistic", "rbf_svm", "random_forest"],
  "max_features": 200,
  "specificity_target": 0.95,
  "seed": 42
}
```

CSV、TSV、Parquet 均支持；
特征表每行一个样本，训练与验证列定义一致；元数据包含样本编号、0/1 标签和
患者编号。两组均需包含两个类别，训练每类至少五个观测。跨组患者或样本重叠、
未匹配记录及重复患者测量会被拒绝，不能用虚构患者编号绕过检查。

Web 和 CLI 使用同一套工具：

1. 添加目录，让智能体先检查预测配置、分组和测量类型，暂不拟合。
2. 审阅后明确要求运行，训练内选择模型与阈值，并生成 ROC、PR、校准图和报告。
3. 要求重新读取已保存摘要，核对选定模型、实际特异度与训练目标的区别。
4. 对同一队列的不同特征集，要求基于已完成研究进行配对比较，不重拟合父模型。

预测研究目前通过对话工具执行，不会单独生成 Plan 面板中的预测步骤按钮。
同一目录内原有的显式 assay 配置仍可生成计划并使用 **Run next step**。
原始计数需完整、非负且为整数，beta 值需在 0–1。其他数值输入的缺失值在训练
流水线内处理。患者身份未证实时必须保留限制；“未证实”不等于已独立。

预测拟合与比较共用每轮六个科学任务的上限，在本地执行并于阶段间检查取消。
Stop 可能需要等待正在进行的 scikit-learn 拟合返回，与 `run_analysis` 的隔离
工作进程终止机制不同。

## 结果与限制

输出含输入指纹、冻结训练选择、模型、验证概率、各模型指标、AUROC 区间、
ROC/PR/校准图和本地报告，遵循原有任务归属与垃圾箱规则。再次读取预测摘要会
检查概率文件哈希，并明确训练选定模型，不把多个模型的指标取平均代替其结果。
ROC、PR 与校准图随产物编号提供类型，报告以本地绑定的图注为准，避免模型把
不同图形的含义标反。

预处理与特征选择在训练折内拟合，阈值来自选定参数下的训练 OOF 概率；它不是
完全嵌套的独立模型选择评估。训练特异度目标不保证在验证集达到。上游发表数据
已经引入的归一化泄漏，也不能靠本软件消除。

配对比较要求相同训练元数据和匹配的验证样本、标签、患者组；当前训练元数据
按文件内容逐字节核对，重排后的等价文件也可能不通过。差值明确为 A−B，区间为
探索性且未作多重比较校正。跨零不能证明优越，也不能证明等效。内部 AUROC
很高甚至为 1，都不代表临床筛查已验证。
