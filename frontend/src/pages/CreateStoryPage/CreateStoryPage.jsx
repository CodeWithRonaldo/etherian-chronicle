import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import Input from "../../components/UI/Input/Input";
import TextArea from "../../components/UI/TextArea/TextArea";
import Button from "../../components/UI/Button/Button";
import { useNotification } from "../../contexts/NotificationContext";
import styles from "./CreateStoryPage.module.css";
import { PinataSDK } from "pinata";
import { StoryData } from "../../contexts/storyData";

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const { createStoryProposal } = useContext(StoryData);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    coverImage: null,
    coverImageUrl: "",
    genre: "",
    firstChapterTitle: "",
    firstChapterContent: "",
    choices: ["", ""],
    collaborators: [],
    tags: "",
  });

  const [newCollaborator, setNewCollaborator] = useState("");

  const steps = [
    { number: 1, label: "Basic Info", completed: currentStep > 1 },
    { number: 2, label: "First Chapter", completed: currentStep > 2 },
    { number: 3, label: "Collaborators", completed: currentStep > 3 },
    { number: 4, label: "Review", completed: false },
  ];

  const genres = [
    "fantasy",
    "sci-fi",
    "mystery",
    "romance",
    "horror",
    "drama",
    "steampunk",
    "adventure",
    "others",
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.summary.trim()) newErrors.summary = "Summary is required";
        if (!formData.genre) newErrors.genre = "Genre is required";
        if (!formData.coverImage)
          newErrors.coverImage = "Cover Image is required";
        if (!formData.tags) newErrors.tags = "Add at least a tag";
        break;
      case 2:
        if (!formData.firstChapterTitle.trim())
          newErrors.firstChapterTitle = "Chapter title is required";
        if (!formData.firstChapterContent.trim())
          newErrors.firstChapterContent = "Chapter content is required";
        if (formData.choices.filter((choice) => choice.trim()).length < 2) {
          newErrors.choices = "At least 2 choices are required";
        }
        break;
      case 3:
        // Collaborators are optional
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
  });

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          coverImage: file,
          coverImageUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const addChoice = () => {
    if (formData.choices.length < 5) {
      setFormData((prev) => ({
        ...prev,
        choices: [...prev.choices, ""],
      }));
    }
  };

  const removeChoice = (index) => {
    if (formData.choices.length > 2) {
      setFormData((prev) => ({
        ...prev,
        choices: prev.choices.filter((_, i) => i !== index),
      }));
    }
  };

  const updateChoice = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) => (i === index ? value : choice)),
    }));
  };

  const addCollaborator = () => {
    if (
      newCollaborator.trim() &&
      !formData.collaborators.includes(newCollaborator.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        collaborators: [
          ...prev.collaborators,
          newCollaborator.trim().toLowerCase(),
        ],
      }));
      setNewCollaborator("");
    }
  };

  const removeCollaborator = (i) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, index) => index !== i),
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !formData) return;
    setIsSubmitting(true);
    try {
      const imageUrl = await pinata.upload.public.file(formData.coverImage);

      const content = await pinata.upload.public.json({
        contentTitle: formData?.firstChapterTitle,
        content: formData?.firstChapterContent,
        genre: formData?.genre,
        tags: formData?.tags.split(", "),
      });

      const storyDetails = [
        formData.title,
        formData.summary,
        `https://black-far-coyote-812.mypinata.cloud/ipfs/${imageUrl.cid}`,
        `https://black-far-coyote-812.mypinata.cloud/ipfs/${content.cid}`,
        formData.choices,
        formData.collaborators,
      ];

      console.log(storyDetails);

      await createStoryProposal(storyDetails);

      console.log("done uploading to smart");

      showSuccess("Story proposal submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
      showError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <PageContainer>
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <h2 className={styles.successTitle}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Proposal Submitted!
            </h2>
            <p className={styles.successText}>
              Your story proposal has been submitted and is now open for
              community voting. You'll be notified when the voting period ends.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button onClick={() => navigate("/proposals")} variant="primary">
                View Proposals
              </Button>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    title: "",
                    summary: "",
                    converImage: null,
                    coverImageUrl: "",
                    firstChapterContent: "",
                    choices: ["", ""],
                    collaborators: [],
                    tags: "",
                  });
                }}
                variant="secondary"
              >
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Create New Story</h1>
          <p className={styles.subtitle}>
            Share your creative vision with the community. Submit a proposal for
            voting or create a story directly.
          </p>
        </header>

        <div className={styles.form}>
          {/* Progress Steps */}
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`${styles.step} ${
                  currentStep === step.number ? styles.active : ""
                } ${step.completed ? styles.completed : ""}`}
              >
                <div className={styles.stepNumber}>
                  {step.completed ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className={styles.stepLabel}>{step.label}</div>
                {index < steps.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </div>
            ))}
          </div>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.errorMessage}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Please fix the errors below to continue.
            </div>
          )}

          {/* Step Content */}
          <div className={styles.stepContent}>
            {currentStep === 1 && (
              <>
                <h2 className={styles.stepTitle}>Basic Information</h2>
                <p className={styles.stepDescription}>
                  Let's start with the basics. Give your story a compelling
                  title and summary that will attract readers.
                </p>

                <div className={styles.formGroup}>
                  <Input
                    label="Story Title"
                    placeholder="Enter a captivating title for your story"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    error={errors.title}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <TextArea
                    label="Story Summary"
                    placeholder="Describe your story in a few compelling sentences. What makes it unique?"
                    value={formData.summary}
                    onChange={(e) =>
                      handleInputChange("summary", e.target.value)
                    }
                    error={errors.summary}
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--space-2)",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Genre <span style={{ color: "var(--error-500)" }}>*</span>
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) =>
                        handleInputChange("genre", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        border: `1px solid ${
                          errors.genre
                            ? "var(--error-500)"
                            : "var(--border-primary)"
                        }`,
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontSize: "var(--font-size-base)",
                      }}
                    >
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.genre && (
                      <div
                        style={{
                          marginTop: "var(--space-1)",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--error-500)",
                        }}
                      >
                        {errors.genre}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--space-2)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Cover Image
                  </label>

                  {formData.coverImageUrl ? (
                    <div className={styles.imagePreview}>
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover preview"
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() => handleInputChange("coverImageUrl", "")}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`${styles.imageUpload} ${
                        dragOver ? styles.dragOver : ""
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() =>
                        document.getElementById("coverImageInput").click()
                      }
                    >
                      <svg
                        className={styles.imageUploadIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className={styles.imageUploadText}>
                        Click to upload or drag and drop
                      </div>
                      <div className={styles.imageUploadHint}>
                        PNG, JPG, GIF up to 10MB
                      </div>
                    </div>
                  )}

                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className={styles.hiddenInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Tags"
                    placeholder="fantasy, magic, adventure (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    helpText="Add tags to help readers discover your story"
                    error={errors.tags}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className={styles.stepTitle}>First Chapter</h2>
                <p className={styles.stepDescription}>
                  Write the opening chapter of your story and provide choices
                  for readers to vote on.
                </p>

                <div className={styles.formGroup}>
                  <Input
                    label="Chapter Title"
                    placeholder="Enter the title for your first chapter"
                    value={formData.firstChapterTitle}
                    onChange={(e) =>
                      handleInputChange("firstChapterTitle", e.target.value)
                    }
                    error={errors.firstChapterTitle}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <TextArea
                    label="Chapter Content"
                    placeholder="Write your opening chapter here. Set the scene, introduce characters, and create an engaging hook that leads to the choices below."
                    value={formData.firstChapterContent}
                    onChange={(e) =>
                      handleInputChange("firstChapterContent", e.target.value)
                    }
                    error={errors.firstChapterContent}
                    rows={8}
                    required
                  />
                </div>

                <div className={styles.choicesSection}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--space-4)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Reader Choices{" "}
                    <span style={{ color: "var(--error-500)" }}>*</span>
                  </label>

                  <div className={styles.choicesList}>
                    {formData.choices.map((choice, index) => (
                      <div key={index} className={styles.choiceItem}>
                        <div className={styles.choiceNumber}>{index + 1}</div>
                        <TextArea
                          placeholder={`Enter choice ${index + 1}...`}
                          value={choice}
                          onChange={(e) => updateChoice(index, e.target.value)}
                          rows={2}
                          className={styles.choiceInput}
                        />
                        {formData.choices.length > 2 && (
                          <button
                            type="button"
                            className={styles.removeChoice}
                            onClick={() => removeChoice(index)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {formData.choices.length < 5 && (
                    <button
                      type="button"
                      className={styles.addChoice}
                      onClick={addChoice}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Another Choice
                    </button>
                  )}

                  {errors.choices && (
                    <div
                      style={{
                        marginTop: "var(--space-2)",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--error-500)",
                      }}
                    >
                      {errors.choices}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className={styles.stepTitle}>Collaborators</h2>
                <p className={styles.stepDescription}>
                  Invite other writers to collaborate on your story.
                  Collaborators can help write future chapters and shape the
                  narrative.
                </p>

                {formData.collaborators.length > 0 && (
                  <div className={styles.collaboratorsSection}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--space-3)",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Current Collaborators
                    </label>
                    <div className={styles.collaboratorsList}>
                      {formData.collaborators.map((collaborator, i) => (
                        <div key={i} className={styles.collaboratorItem}>
                          <div className={styles.collaboratorInfo}>
                            <span className={styles.collaboratorName}>
                              {collaborator}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={styles.removeCollaborator}
                            onClick={() => removeCollaborator(i)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--space-2)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Add Collaborator
                  </label>
                  <div className={styles.addCollaborator}>
                    <Input
                      placeholder="Enter collaborator's wallet Address"
                      value={newCollaborator}
                      onChange={(e) => setNewCollaborator(e.target.value)}
                      className={styles.collaboratorInput}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCollaborator();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCollaborator}
                      disabled={!newCollaborator.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {/* <Input
                  label="Vote Duration (in seconds)"
                  type="number"
                  value={formData.voteDuration}
                  onChange={(e) =>
                    handleInputChange("voteDuration", BigInt(e.target.value))
                  }
                  error={errors.voteDuration}
                  required
                /> */}
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className={styles.stepTitle}>Review & Submit</h2>
                <p className={styles.stepDescription}>
                  Review your story details before submitting. Once submitted,
                  your {formData.submissionType} will be{" "}
                  {formData.submissionType === "proposal"
                    ? "open for community voting"
                    : "immediately available to readers"}
                  .
                </p>

                <div className={styles.summary}>
                  <h3 className={styles.summaryTitle}>Story Summary</h3>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Title:</span>
                    <span className={styles.summaryValue}>
                      {formData.title}
                    </span>
                  </div>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Genre:</span>
                    <span className={styles.summaryValue}>
                      {formData.genre}
                    </span>
                  </div>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>First Chapter:</span>
                    <span className={styles.summaryValue}>
                      {formData.firstChapterTitle}
                    </span>
                  </div>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Summary</span>
                    <span className={styles.summaryValue}>
                      {formData.summary}
                    </span>
                  </div>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Choices:</span>
                    <span className={styles.summaryValue}>
                      {
                        formData.choices.filter((choice) => choice.trim())
                          .length
                      }{" "}
                      options
                    </span>
                  </div>

                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Collaborators:</span>
                    <span className={styles.summaryValue}>
                      {formData.collaborators.length} invited
                    </span>
                  </div>

                  {formData.tags && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Tags:</span>
                      <span className={styles.summaryValue}>
                        {formData.tags}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={styles.actionButton}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                className={styles.actionButton}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                className={styles.actionButton}
              >
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateStoryPage;
