<section class="features">
    <div class="container">
        <div class="row">
            <div class="col-12 col-lg-6 intro-text-features mt-5 mb-3 mb-md-3 mt-md-0">
                <?php the_field('intro_text_features') ?>
            </div>
            <div class="col-12">
                <div class="row">
            <?php if (have_rows('feature_blocks')): ?>
                <?php while (have_rows('feature_blocks')): the_row(); ?>
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="single-feature">
                            <img src="<?php the_sub_field('icon'); ?>" class="img-fluid feature-icon"/>
                            <h2><?php the_sub_field('feature_title'); ?></h2>
                            <p><?php the_sub_field('feature_text'); ?></p>
                        </div>
                    </div>
                <?php endwhile; ?>
            <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>